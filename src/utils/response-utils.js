export function formatErrorsToFormFields(errors){
    if(!errors) return [];
    const fields=Object.keys(errors);
    return fields.map((f,i)=>{
        return {
            name: f,
            errors:errors[f]
        }
    })
}