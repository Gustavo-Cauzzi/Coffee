import axios from "axios";

export const getApi = () =>
    axios.create({
        baseURL: `${location.protocol}//${location.host}/api`,
    });
