
//patient search api
export default function tokenApi(fetch, baseUrl) {

    return {
        fetchMorningList() {
            return fetch(`${baseUrl}/fetch_morning`)
        },

        fetchAfternoonList() {
            return fetch(`${baseUrl}/fetch_afternoon`)
        },

        fetchCurrent(data) {
            return fetch.post(`${baseUrl}/fetch_current`,{data})
        },
        cancelToken(data) {
            return fetch.post(`${baseUrl}/cancel`,{data})
        },
        setAsCompleted(data) {
            return fetch.post(`${baseUrl}/completed`,{data})
        },
    }
}