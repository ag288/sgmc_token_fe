
//patient search api
export default function reviewApi(fetch, baseUrl) {

    return {
        generateTokenReview(data) {
            return fetch.post(`${baseUrl}/generate`, { data })
        },

        decideSlotsReview() {
            console.log("hi")
            return fetch(`${baseUrl}/slot`)
        },

        fetchTokensReview(data) {
            return fetch.post(`${baseUrl}/fetch-token`, { data })
        },

    }
}

