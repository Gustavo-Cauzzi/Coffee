import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Payment } from "@shared/@types/Payment";
import { getApi } from "@shared/services/api";

export const findAllPayments = createAsyncThunk("app/paymentSlice/findAllPayments", async () => {
    return await getApi().get<Payment[]>("/payments");
});

export const updatePayment = createAsyncThunk("app/paymentSlice/updatePayment", async (payment: Payment) => {
    return await getApi().put<Payment[]>("/payments", payment);
});

export const paymentSlice = createSlice({
    name: "app/paymentSlice",
    initialState: {
        payments: [] as Payment[],
    },
    reducers: {},
    extraReducers(builder) {
        builder.addCase(updatePayment.fulfilled, (state, action) => {
            state.payments = state.payments.map((p) => (p.id === action.meta.arg.id ? action.meta.arg : p));
        });
        builder.addCase(findAllPayments.fulfilled, (state, action) => {
            state.payments = action.payload.data;
        });
    },
});

export default paymentSlice.reducer;
