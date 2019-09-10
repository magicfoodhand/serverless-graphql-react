export default {
    success: (response) => {
        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
    },
    error: (response) => {
        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
    },
}