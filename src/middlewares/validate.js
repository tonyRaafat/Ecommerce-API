import { throwError } from "../utils/throwerror.js"


export const validate = (schema)=>{
    return (req,res,next)=>{
        let {error} = schema.validate({...req.body,...req.params,...req.query})
        if(error){
            next(new throwError(error,400))
        }else{
            next()
        }
    }
}