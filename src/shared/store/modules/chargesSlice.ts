import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Charge } from "@shared/@types/Charge";
import { getApi } from "@shared/services/api";

export const findAllCharges = createAsyncThunk("app/chargeSlice/findAllCharges", async () => {
    return await getApi().get<Charge[]>("/charges");
});

export const chargeSlice = createSlice({
    name: "app/chargeSlice",
    initialState: {
        charges: [] as Charge[],
        isLoading: false,
    },
    reducers: {},
    extraReducers(builder) {
        builder.addCase(findAllCharges.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(findAllCharges.fulfilled, (state, action) => {
            state.charges = action.payload.data;
            state.isLoading = false;
        });
    },
});

export default chargeSlice.reducer;
