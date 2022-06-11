
//patient search api
export default function userApi(fetch, baseUrl) {

    return {
        verifyUser(data) {
            return fetch.post(`${baseUrl}/login`, { data })
        },
        }
}