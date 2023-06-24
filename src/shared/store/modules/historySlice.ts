import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { History } from "@shared/@types/History";
import { getApi } from "@shared/services/api";

export const findAllHistory = createAsyncThunk("app/historySlice/findAllHistory", async () => {
    return await getApi().get<History[]>("/histories");
});

export const historySlice = createSlice({
    name: "app/historySlice",
    initialState: {
        history: [] as History[],
    },
    reducers: {},
    extraReducers(builder) {
        builder.addCase(findAllHistory.fulfilled, (state, action) => {
            state.history = action.payload.data;
        });
    },
});

export default historySlice.reducer;
