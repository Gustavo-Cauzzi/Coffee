import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "@shared/@types/User";
import { getApi } from "@shared/services/api";
import { decode } from "jsonwebtoken";

const PREFIX = "app/auth";

interface AuthState {
    isAuthenticated: boolean;
    user?: User;
}

interface LogInParams {
    username: string;
    password: string;
}
export const logIn = createAsyncThunk(`${PREFIX}/logIn`, async (payload: LogInParams) => {
    type JWTResponse = { token: string };
    const response = await getApi().post<JWTResponse>("/login", payload);
    const jwtToken = response.data.token;
    document.cookie = "jwt=" + jwtToken;
    const user = decode(jwtToken) as User;
    return user;
});

export const logOut = createAsyncThunk(`${PREFIX}/logOut`, async () => {
    document.cookie += "jwt=;Max-Age=0";
});

export const authSlice = createSlice({
    name: PREFIX,
    initialState: {
        isAuthenticated: false,
        user: undefined,
    } as AuthState,
    reducers: {
        // actionQualquer(state, action: PayloadAction) {},
    },
    extraReducers(builder) {
        builder.addCase(logIn.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        });
        builder.addCase(logOut.fulfilled, (state) => {
            state.user = undefined;
            state.isAuthenticated = false;
        });
        // builder.addMatcher(isAnyOf(,), (state, action) => {});
    },
});

// export const { actionQualquer } = reTbTabelaSlice.actions;
export default authSlice.reducer;
