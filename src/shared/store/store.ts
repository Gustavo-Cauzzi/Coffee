import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./modules/authSlice";
import { createWrapper } from "next-redux-wrapper";
import historySlice from "./modules/historySlice";
import chargesSlice from "./modules/chargesSlice";
import paymentSlice from "./modules/paymentSlice";

export const store = () =>
    configureStore({
        reducer: {
            auth: authSlice,
            history: historySlice,
            charges: chargesSlice,
            payments: paymentSlice,
        },

        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    });

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<ReturnType<typeof store>["getState"]>;
export type AppDispatch = ReturnType<typeof store>["dispatch"];

export const wrapper = createWrapper<AppStore>(store);
