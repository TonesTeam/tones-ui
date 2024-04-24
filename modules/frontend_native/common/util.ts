import axios, { Axios, AxiosError, AxiosResponse, Method } from "axios";
import { parseISO } from "date-fns";
import { ProtocolDto } from "sharedlib/dto/protocol.dto";

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

const domain = "https://tones-api-8rpnd.ondigitalocean.app";
//const domain = "http://192.168.129.126:8080";
const prefix = "/api/v2";

export async function getRequest<T>(path: string): Promise<AxiosResponse<T, any> | AxiosError> {
  const fullpath = domain + prefix + path;
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
  const fullpath = domain + prefix + path;
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
