import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "@shared/@types/User";
import { getApi } from "@shared/services/api";
import { decode } from "jsonwebtoken";
import { HYDRATE } from "next-redux-wrapper";

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
    const response = await getApi().post<JWTResponse>("/users/login", payload);
    const jwtToken = response.data.token;
    document.cookie = "jwt=" + jwtToken;
    const user = decode(jwtToken) as User;
    localStorage.setItem("@coffee/user", JSON.stringify(user));
    return user;
});

export const logOut = createAsyncThunk(`${PREFIX}/logOut`, async () => {
    localStorage.removeItem("@coffee/user");
    document.cookie += "jwt=;Max-Age=0";
});

export const loadUser = createAsyncThunk(`${PREFIX}/loadUser`, async () => {
    const user = localStorage.getItem("@coffee/user");
    if (!user) return;
    return JSON.parse(user) as User;
});

export const authSlice = createSlice({
    name: PREFIX,
    initialState: {
        isAuthenticated: false,
        user: undefined,
    } as AuthState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(HYDRATE, (state, action) => {
            return {
                ...state,
                ...(action as any).payload[PREFIX],
            };
        });
        builder.addCase(logOut.fulfilled, (state) => {
            state.user = undefined;
            state.isAuthenticated = false;
        });
        builder.addMatcher(isAnyOf(logIn.fulfilled, loadUser.fulfilled), (state, action) => {
            console.log("action.payload: ", action.payload);
            state.user = action.payload;
            state.isAuthenticated = true;
        });
    },
});

export default authSlice.reducer;
