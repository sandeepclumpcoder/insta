module.exports.validationBodyReq = async (schema , data)=>{
    const result = schema.validate(data);
    if(result && result.error && result.error.details){
        console.log('message' , result.error.details[0].message);
        let response = {
            message : result.error.details[0].message,
        }
        throw response;
    }
}