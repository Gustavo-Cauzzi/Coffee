import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Payment } from "@shared/@types/Payment";
import { getApi } from "@shared/services/api";

export const findAllPayments = createAsyncThunk("app/paymentSlice/findAllPayments", async () => {
    return await getApi().get<Payment[]>("/payments");
});

export const paymentSlice = createSlice({
    name: "app/paymentSlice",
    initialState: {
        payments: [] as Payment[],
    },
    reducers: {},
    extraReducers(builder) {
        builder.addCase(findAllPayments.fulfilled, (state, action) => {
            state.payments = action.payload.data;
        });
    },
});

export default paymentSlice.reducer;
