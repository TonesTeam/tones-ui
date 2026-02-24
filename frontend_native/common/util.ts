import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import * as Network from 'expo-network';

const client = axios.create();
const isoDateFormat =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

let domain: string | null = null;
let backdoorAddress: string | null = null;
const prefix = '';

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

async function scanNetwork(
    ipList: string[],
    setProgressValue: ((value: number) => void) | undefined,
): Promise<string | null> {
    let completed = 0;

    const requests = ipList.map(async (ip, i) => {
        const fullip = `http://${ip}:8080/health`;

        try {
            const resp = (await client.get(fullip, { timeout: 500 })).status;
            console.log(`Response from ${fullip}: ${resp}`);

            if (setProgressValue) {
                completed++;
                const progress = (completed / ipList.length) * 100;
                console.log(
                    `Scanning ${fullip} (${completed}/${ipList.length}) - ${progress.toFixed(1)}%`,
                );
                setProgressValue(progress);
            }

            if (resp === 200) {
                return ip;
            }
        } catch (err) {
            console.log(`Response from ${fullip}: 500`);

            if (setProgressValue) {
                completed++;
                const progress = (completed / ipList.length) * 100;
                setProgressValue(progress);
            }
        }
        return null;
    });

    const results = await Promise.all(requests);
    return results.find((result) => result !== null) || null;
}

async function findBE(
    setProgressValue: ((value: number) => void) | undefined,
): Promise<string> {
    const ipAddress = await Network.getIpAddressAsync();
    const subnetMask = '255.255.254.0';
    console.log(`subnet mask - ${subnetMask}`);
    const ipList = generateIPRange(ipAddress, subnetMask);

    let foundIP: string | null = '';

    if (backdoorAddress) foundIP = backdoorAddress;
    else foundIP = await scanNetwork(ipList, setProgressValue);

    console.log(`Backdoor IP - ${backdoorAddress}`);
    return `http://${foundIP}:8080`;
}

export const setBackdoorAddress = (address: string) => {
    console.log(`Setting backdoor address to ${address}`);
    backdoorAddress = address;
    domain = null; // Reset cached domain to force findBE() to run again
    domainPromise = null;
};

export const getBackdoorAddress = () => {
    return backdoorAddress;
};

let domainPromise: Promise<string> | null = null;

export async function getDomain(
    setProgressValue: ((value: number) => void) | undefined,
) {
    if (domain == null || domain.includes('null')) {
        if (!domainPromise) {
            domainPromise = findBE(setProgressValue); // Start the initial findBE call
            domain = await domainPromise; // Wait for it to complete and store the result in domain
            domainPromise = null; // Clear the temporary promise once done
        } else {
            domain = await domainPromise; // Wait for the ongoing promise if it already exists
        }
    }
    return domain;
}

export async function getRequest<T>(
    path: string,
): Promise<AxiosResponse<T, any> | AxiosError> {
    const fullpath = (await getDomain()) + prefix + path;
    console.log('GET: ' + fullpath);
    //return await client.get(fullpath);
    try {
        return await client.get(fullpath);
    } catch (error) {
        if (axios.isAxiosError(error) && !error.response) {
            console.error('Network Error:', error.message);
            return error;
        } else {
            console.error('Other Error:', error);
            throw error;
        }
    }
}

export async function makeRequest<R>(
    method: Method,
    path: string,
    payload?: string,
): Promise<AxiosResponse<R, any>> {
    console.log(`Making ${method} request to ${path} with payload: ${payload}`);
    const fullpath = (await getDomain()) + prefix + path;
    console.log(`${method}: ${fullpath}`);
    return await client.request({
        headers: {
            'Content-Type': 'application/json',
        },
        method: method,
        url: fullpath,
        data: payload,
        validateStatus: null,
    });
}

export const formatDuration = (seconds: number): string => {
    if (seconds < 60) {
        return `${seconds} sec`;
    }

    const minutes = Math.floor(seconds / 60);
    const extra_seconds = seconds % 60;
    if (extra_seconds === 0) {
        return `${minutes} min`;
    }

    return `${minutes} min ${extra_seconds} sec`;
};

export const formatSocialMediaTime = (dateInput: number): string => {
    const now = new Date();
    const date = new Date(dateInput * 1000);
    const diffMs = now.getTime() - date.getTime();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;

    if (diffMs < minute) {
        return 'just now';
    } else if (diffMs < hour) {
        const mins = Math.floor(diffMs / minute);
        return `${mins} minute${mins === 1 ? '' : 's'} ago`;
    } else if (diffMs < day) {
        const hrs = Math.floor(diffMs / hour);
        return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
    } else if (diffMs < week) {
        const days = Math.floor(diffMs / day);
        return `${days} day${days === 1 ? '' : 's'} ago`;
    } else {
        return date.toLocaleDateString();
    }
};
