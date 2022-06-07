
//patient search api
export default function settingsApi(fetch, baseUrl) {

    return {
        fetchSettings() {
            return fetch(`${baseUrl}/fetch`)
        },
        updateSettings(data) {
            return fetch.post(`${baseUrl}/update`, { data })
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
    }
}