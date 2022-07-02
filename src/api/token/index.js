
//patient search api
export default function tokenApi(fetch, baseUrl) {

    return {
        fetchMorningList() {
            return fetch(`${baseUrl}/fetch_morning`)
        },

        fetchAfternoonList() {
            return fetch(`${baseUrl}/fetch_afternoon`)
        },
        fetchLastToken() {
            return fetch(`${baseUrl}/fetch_last`)
        },
        fetchCurrent() {
            return fetch(`${baseUrl}/fetch_current`)
        },
        cancelToken(data) {
            return fetch.post(`${baseUrl}/cancel`,{data})
        },
        setAsCompleted() {
            return fetch.post(`${baseUrl}/completed`)
        },
        setAsArrived(data) {
            return fetch.post(`${baseUrl}/arrived`,{data})
        },
        callNewToken(data) {
            console.log(data)
            return fetch.post(`${baseUrl}/call`,{data})
        },
        callNextToken(data) {
            return fetch.post(`${baseUrl}/next`,{data})
        },
        editFileNumber(data) {
            return fetch.post(`${baseUrl}/edit-file`,{data})
        },

        invitePatient(data) {
            return fetch.post(`${baseUrl}/invite`,{data})
        },
        saveReview(data) {
            return fetch.post(`${baseUrl}/save-review`,{data})
        },

        
    }
}