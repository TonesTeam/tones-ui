import axios, { AxiosError, AxiosResponse, Method } from "axios";
import * as Network from 'expo-network';



const client = axios.create();
const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

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
  const requests = ipList.map(async (ip) => {
    const fullip = `http://${ip}:8080/api/v2/ping`;
    try {
      const resp = (await client.get(fullip, {timeout: 500})).status;
      console.log(`Response from ${fullip}: ${resp}`);
      if (resp === 200) {
        return ip;
      }
    } catch (err) {
      console.log(`Response from ${fullip}: 500`);
    }
    return null;
  });
  const results = await Promise.all(requests);
  return results.find((result) => result !== null) || null;
}

async function findBE(): Promise<string> {
  const ipAddress = await Network.getIpAddressAsync();
  const subnetMask = "255.255.254.0";
  console.log(`subnet mask - ${subnetMask}`)
  const ipList = generateIPRange(ipAddress, subnetMask);
  const foundIP = await scanNetwork(ipList);
  return  'http://' + foundIP + ':8080';
}


let domainPromise: Promise<string> | null = null;

async function getDomain() {
  if (domain == null) {
    if (!domainPromise) {
      domainPromise = findBE();  // Start the initial findBE call
      domain = await domainPromise;  // Wait for it to complete and store the result in domain
      domainPromise = null;  // Clear the temporary promise once done
    } else {
      domain = await domainPromise;  // Wait for the ongoing promise if it already exists
    }
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
