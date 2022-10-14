
//patient search api
export default function reviewApi(fetch, baseUrl) {

    return {
        generateTokenReview(data) {
            return fetch.post(`${baseUrl}/generate`, { data })
        },
        updateTokenReview(data) {
            return fetch.post(`${baseUrl}/update`, { data })
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

        fetchReviewList(data) {
            return fetch.post(`${baseUrl}/list`,{data})
        },

        fetchRescheduleReviewList(data) {
            return fetch.post(`${baseUrl}/reschedule-list`,{data})
        },

        deleteReview(data) {
            return fetch.post(`${baseUrl}/delete`, { data })
        }

    }
}

