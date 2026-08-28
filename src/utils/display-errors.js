import { notifyError } from "./messages";

export default function displayError(error){
    let errorToDisplay='';
    const res=error.response;
    const data=res?.data;
    const message=error.message;
    const title=data?.title;
    const details=data?.detail;
    const nfe=data?.errors?.non_field_errors;
    const itHasNonFieldErrors=nfe&&nfe.length>0;

    if(title||details){
        errorToDisplay=`${title}${details || ''}`;
    }
    else if(itHasNonFieldErrors){
        errorToDisplay=nfe[0];
    }
    else{
        errorToDisplay=message;
    }
    notifyError(errorToDisplay);
};