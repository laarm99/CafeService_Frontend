import { message } from "antd";

export const notifySuccess=(msg)=>{
    message.success(msg);
}
export const notifyError=(msg)=>{
    message.error(msg);
}