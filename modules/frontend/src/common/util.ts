import axios, { Axios, AxiosResponse } from 'axios'

const domain = window.location.origin
const prefix = "/api"

export async function getRequest<T>(path: string): Promise<AxiosResponse<T, any>> {
    const fullpath = domain + prefix + path
    console.log("GET: " + fullpath)
    return await axios.get(fullpath)
}

export async function postRequest<T>(path: string, payload: string): Promise<AxiosResponse<T, any>> {
    const fullpath = domain + prefix + path
    console.log("POST: " + fullpath)
    return await axios.post(fullpath, payload, { validateStatus: null })
}

