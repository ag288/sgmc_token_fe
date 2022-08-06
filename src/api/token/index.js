
//patient search api
export default function tokenApi(fetch, baseUrl) {

    return {
        fetchDataForExcel(data) {
            return fetch.post(`${baseUrl}/excel`,{data})
        },

        fetchDoctors() {
            return fetch(`${baseUrl}/doctors`)
        },

        fetchDuplicatePatients() {
            return fetch(`${baseUrl}/duplicate-patients`)
        },

        fetchMorningList(data) {
            return fetch.post(`${baseUrl}/fetch_morning`,{data})
        },

        fetchAfternoonList() {
            return fetch(`${baseUrl}/fetch_afternoon`)
        },

        fetchWalkInList() {
            return fetch(`${baseUrl}/fetch_walk_in`)
        },

        fetchLastToken() {
            return fetch(`${baseUrl}/fetch_last`)
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

        editName(data) {
            return fetch.post(`${baseUrl}/edit-name`,{data})
        },

        invitePatient(data) {
            return fetch.post(`${baseUrl}/invite`,{data})
        },
        saveReview(data) {
            return fetch.post(`${baseUrl}/save-review`,{data})
        },

        
    }
}