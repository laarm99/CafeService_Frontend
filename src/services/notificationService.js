let messageApi = null;

export const setMessageApi = (api) => {
    messageApi = api;
};

export const notifySuccess = (msg) => {
    messageApi?.success(msg);
};

export const notifyError = (msg) => {
    messageApi?.error(msg);
};

export const notifyWarning = (msg) => {
    messageApi?.warning(msg);
};

export const notifyInfo = (msg) => {
    messageApi?.info(msg);
};