
//patient search api
export default function reviewApi(fetch, baseUrl) {

    return {
        generateTokenReview(data) {
            return fetch.post(`${baseUrl}/generate`, { data })
        },

        decideSlotsReview(data) {
            return fetch.post(`${baseUrl}/slot`, { data })
        },

        fetchTokensReview(data) {
            return fetch.post(`${baseUrl}/fetch-token`, { data })
        },

        reviewExists(data) {
            return fetch.post(`${baseUrl}/existing`, { data })
        },

    }
}

