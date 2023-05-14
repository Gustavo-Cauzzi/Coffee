import axios from "axios";

export const getApi = () => {
    const api = axios.create({
        baseURL: `${location.protocol}//${location.host}/api`,
    });

    // api.interceptors.response.use((response) => {
    //     if(response.status === 270) {

    //     }
    // }, (res) => res)
    return api;
};
