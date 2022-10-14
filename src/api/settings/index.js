
//patient search api
export default function settingsApi(fetch, baseUrl) {

    return {
        fetchSettings(data) {
            return fetch.post(`${baseUrl}/fetch`,{data})
        },
        fetchReasons() {
            return fetch(`${baseUrl}/reasons`)
        },
        updateSettings(data) {
            return fetch.post(`${baseUrl}/update`, { data })
        },
        updateAutocall(data) {
            return fetch.post(`${baseUrl}/update-autocall`, { data })
        },
        updateDoctorIn(data) {
            return fetch.post(`${baseUrl}/update-doctor-in`, { data })
        },
        updateHours(data) {
            return fetch.post(`${baseUrl}/update-hours`, { data })
        },

        updateKill(data) {
            return fetch.post(`${baseUrl}/update-kill`, { data })
        },

        updateReasons(data) {
            return fetch.post(`${baseUrl}/update-reasons`, { data })
        },
        fetchHolidays(data) {
            return fetch.post(`${baseUrl}/holidays`,{data})
        },
        updateHolidays(data) {
            return fetch.post(`${baseUrl}/update-holidays`,{data})
        },
        deleteHolidays(data) {
            return fetch.post(`${baseUrl}/delete-holidays`,{data})
        },
        checkAvailability(data) {
            return fetch.post(`${baseUrl}/check`, {data})
        },
        checkReviewOnHolidays(data){
            return fetch.post(`${baseUrl}/check-reviews`, {data})
        }
    }
}