import axios, { Axios, AxiosError, AxiosResponse, Method } from "axios";
import { parseISO } from "date-fns";
import { ProtocolDto } from "sharedlib/dto/protocol.dto";
import { fetch } from "@react-native-community/netinfo";
import { chunk } from "lodash";
import * as Network from 'expo-network';


const client = axios.create();
const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

// function isIsoDateString(value: any): boolean {
//   return value && typeof value === "string" && isoDateFormat.test(value);
// }

// export function handleDates(body: any) {
//   if (body === null || body === undefined || typeof body !== "object") return body;

//   for (const key of Object.keys(body)) {
//     const value = body[key];
//     if (isIsoDateString(value)) {
//       body[key] = parseISO(value);
//     } else if (typeof value === "object") handleDates(value);
//   }
// }

// client.interceptors.response.use((originalResponse) => {
//   handleDates(originalResponse.data);
//   return originalResponse;
// });

//const domain = "https://tones-api-8rpnd.ondigitalocean.app";
//const domain = "http://192.168.129.126:8080";
let domain: string | null = null;
const prefix = "/api/v2";


function generateIPRange(ip, subnetMask) {
  const ipParts = ip.split('.').map(Number);
  const maskParts = subnetMask.split('.').map(Number);

  // Convert IP address and subnet mask to 32-bit integers
  const ipInt = ipParts.reduce((acc, part) => (acc << 8) | part, 0) >>> 0;
  const maskInt = maskParts.reduce((acc, part) => (acc << 8) | part, 0) >>> 0;

  // Calculate network and broadcast addresses
  const networkInt = ipInt & maskInt;
  const broadcastInt = networkInt | (~maskInt >>> 0);

  const ipList = [];

  // Iterate over the valid host IP addresses
  for (let i = networkInt + 1; i < broadcastInt; i++) {
    const octet1 = (i >>> 24) & 255;
    const octet2 = (i >>> 16) & 255;
    const octet3 = (i >>> 8) & 255;
    const octet4 = i & 255;
    const ipStr = `${octet1}.${octet2}.${octet3}.${octet4}`;
    ipList.push(ipStr);
  }

  return ipList;
}


async function scanNetwork(ipList: string[]): Promise<string | null> {
  const backendIPs: string[] = [];
  const totalIPs = ipList.length;
  const batch = 20;
  const ipBatches = chunk(ipList, batch);
  for(const ips of ipBatches) {
    const requests = ips.map((ip) => {
      const url = `http://${ip}:8080/api/v2/ping`; // Include the protocol
      return client.get(url, {timeout: 500})
        .catch(e => e)
        .then(r => {
          console.log(`Received response from ${url}: ${r}`);
          if(ip.split('.')[3] == "84") {
            console.log('=================================')
          }
          if (r.status == 200) {
            backendIPs.push(ip);
          }
        })
    });
    await axios.all(requests)
  }
  // Create an AbortController for the batch
  return backendIPs[0];
}

async function findBE(): Promise<string> {
  const ipAddress = await Network.getIpAddressAsync();
  const subnetMask = "255.255.254.0";
  const ipList = generateIPRange(ipAddress, subnetMask);
  const foundIP = await scanNetwork(ipList);
  return  'http://' + foundIP + ':8080';
}

async function getDomain() {
  if (domain == null) {
    domain = await findBE();
  }
  return domain;
}


export async function getRequest<T>(path: string): Promise<AxiosResponse<T, any> | AxiosError> {
  const fullpath = await getDomain() + prefix + path;
  console.log("GET: " + fullpath);
  //return await client.get(fullpath);
  try {
    return await client.get(fullpath);
  } catch (error) {
    if (axios.isAxiosError(error) && !error.response) {
      //console.error("Network Error:", error.message);
      return error;
    } else {
      console.error("Other Error:", error);
      //throw error;
    }
  }
}

export async function makeRequest<R>(
  method: Method,
  path: string,
  payload?: string
): Promise<AxiosResponse<R, any>> {
  const fullpath = await getDomain() + prefix + path;
  console.log(`${method}: ${fullpath}`);
  return await client.request({
    headers: {
      "Content-Type": "application/json",
    },
    method: method,
    url: fullpath,
    data: payload,
    validateStatus: null,
  });
}
