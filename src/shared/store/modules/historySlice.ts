import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { History } from "@shared/@types/History";
import { getApi } from "@shared/services/api";
import { isAfter } from "date-fns";

export const findAllHistory = createAsyncThunk("app/historySlice/findAllHistory", async () => {
    const response = await getApi().get<History[]>("/histories");
    return [...response.data].sort((a, b) => (isAfter(a.created_at, b.created_at) ? -1 : 1));
});

export const historySlice = createSlice({
    name: "app/historySlice",
    initialState: {
        history: [] as History[],
    },
    reducers: {},
    extraReducers(builder) {
        builder.addCase(findAllHistory.fulfilled, (state, action) => {
            state.history = action.payload;
        });
    },
});

export default historySlice.reducer;
