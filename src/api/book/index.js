
//patient search api
export default function bookApi(fetch, baseUrl) {

    return {
        fetchPatients(data) {
            return fetch.post(`${baseUrl}/fetch`, { data })
        },
        searchPatients(data) {
            return fetch.post(`${baseUrl}/search`, { data })
        },
        createPatient(data) {
            return fetch.post(`${baseUrl}/create`, { data })
        },
        generateToken(data) {
            return fetch.post(`${baseUrl}/generate`, { data })
        },


        decideSlots(data) {
            return fetch.post(`${baseUrl}/slot`, {data})
        },

        fetchTokens(data) {
            return fetch.post(`${baseUrl}/fetch-token`, { data })
        },

    }
}

