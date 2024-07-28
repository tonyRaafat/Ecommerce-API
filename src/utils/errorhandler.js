export function errorHandler(error, req, res, next ){
    error.statusCode = error.statusCode || 500
    console.error(error);
    return res.status(error.statusCode).send({
        error:error.message
    })
}