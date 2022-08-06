
//patient search api
export default function physioApi(fetch, baseUrl) {

    return {

        fetchSlotsforPhysio(data) {
            return fetch.post(`${baseUrl}/list`,{data})
        },

    }
}

