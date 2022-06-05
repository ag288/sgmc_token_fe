
import axios from "axios";
import tokenApi from "./token"
export const fetch = axios.create({
    baseURL: "https://prism-ablaze-moss.glitch.me", // Replace with Env-Specific URL
    timeout: 8000,
    headers: {
        common: {
            "Content-Type": "application/json",
        },
    },
    transformResponse: [(res) => res], // change to res.data
});

export const rawFetch = (url) =>
    axios.create({
        baseURL: url,
        timeout: 4000,
        headers: {
            common: {
                "Content-Type": "application/json",
            },
        },
    });



const api = {
    token: tokenApi(fetch, "/token"),
};

export default api;
