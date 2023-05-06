import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./modules/authSlice";

export const store = () =>
    configureStore({
        reducer: {
            auth: authSlice,
        },
    });

export type RootState = ReturnType<ReturnType<typeof store>["getState"]>;
export type AppDispatch = ReturnType<typeof store>["dispatch"];
