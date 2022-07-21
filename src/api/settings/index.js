
//patient search api
export default function settingsApi(fetch, baseUrl) {

    return {
        fetchSettings() {
            return fetch(`${baseUrl}/fetch`)
        },
        fetchReasons() {
            return fetch(`${baseUrl}/reasons`)
        },
        updateSettings(data) {
            return fetch.post(`${baseUrl}/update`, { data })
        },

        updateHours(data) {
            return fetch.post(`${baseUrl}/update-hours`, { data })
        },

        updateReasons(data) {
            return fetch.post(`${baseUrl}/update-reasons`, { data })
        },
        fetchHolidays() {
            return fetch(`${baseUrl}/holidays`)
        },
        updateHolidays(data) {
            return fetch.post(`${baseUrl}/update-holidays`,{data})
        },
        deleteHolidays(data) {
            return fetch.post(`${baseUrl}/delete-holidays`,{data})
        },
        checkAvailability() {
            return fetch(`${baseUrl}/check`)
        }
    }
}