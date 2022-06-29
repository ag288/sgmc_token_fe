
//patient search api
export default function physioApi(fetch, baseUrl) {

    return {

        fetchSlotsforPhysio() {
            return fetch(`${baseUrl}/list`)
        },

    }
}

