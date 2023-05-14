import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./modules/authSlice";
import { createWrapper } from "next-redux-wrapper";

export const store = () =>
    configureStore({
        reducer: {
            auth: authSlice,
        },
    });

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<ReturnType<typeof store>["getState"]>;
export type AppDispatch = ReturnType<typeof store>["dispatch"];

export const wrapper = createWrapper<AppStore>(store);
