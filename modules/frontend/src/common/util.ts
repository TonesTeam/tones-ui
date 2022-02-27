import axios from 'axios'

const domain = window.location.origin
const prefix = "/api"

export async function getRequest(path: string) {
    const fullpath = domain + prefix + path
    console.log("GET: " + fullpath)
    return axios.get(fullpath)
}