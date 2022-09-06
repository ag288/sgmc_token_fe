
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

        mergeDuplicatePatients(data) {
            return fetch.post(`${baseUrl}/merge-duplicates`,{data})
        },

        fetchTokenList(data) {
            return fetch.post(`${baseUrl}/list`,{data})
        },

        fetchTokenListForPrint(data) {
            return fetch.post(`${baseUrl}/print-list`,{data})
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

        undoArrived(data) {
            return fetch.post(`${baseUrl}/undo-arrived`,{data})
        },

        bookWalkIn(data) {
            return fetch.post(`${baseUrl}/walk-in`,{data})
        },
        setAsDelayed(data) {
            return fetch.post(`${baseUrl}/delayed`,{data})
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

        fetchAlerts(){
            return fetch(`${baseUrl}/alerts`)
        },

       updateReason(data){
            return fetch.post(`${baseUrl}/update-reason`,{data})
        },
        scanQr(data){
            return fetch.post(`${baseUrl}/qr`,{data})
        },
        arrivedQR(data){
            return fetch.post(`${baseUrl}/arrived-qr`,{data})
        }
    }
}