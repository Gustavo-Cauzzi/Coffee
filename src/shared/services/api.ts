import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

export const getApi = () => {
    const api = axios.create({
        baseURL: `${location.protocol}//${location.host}/api`,
        validateStatus: (status) => status < 400 && status !== 280,
    });

    api.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            if (error.response?.status === 280) {
                toast.error((error.response.data as any | undefined)?.message ?? "Ocorreu um erro");
            }
        }
    );
    return api;
};
