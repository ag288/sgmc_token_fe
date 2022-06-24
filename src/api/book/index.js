
//patient search api
export default function bookApi(fetch, baseUrl) {

    return {
        fetchPatients(data) {
            return fetch.post(`${baseUrl}/fetch`, { data })
        },
        createPatient(data) {
            return fetch.post(`${baseUrl}/create`, { data })
        },
        generateToken(data) {
            return fetch.post(`${baseUrl}/generate`, { data })
        },


        decideSlots() {
            return fetch(`${baseUrl}/slot`)
        },

        fetchTokens(data) {
            return fetch.post(`${baseUrl}/fetch-token`, { data })
        },

    }
}

