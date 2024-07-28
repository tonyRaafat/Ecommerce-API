export function throwError(errorMessage, statusCode = 400) {
    let error = new Error(errorMessage)
    error.statusCode = statusCode
    return error
}