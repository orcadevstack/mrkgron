import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";
import { login, logout, getMe } from "@/lib/auth";

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = { user: null, isLoading: false, error: null };

export const loginUser = createAsyncThunk(
    "auth/login",
    async ({ email, password }: { email: string; password: string }) => {
        const { user } = await login(email, password);
        return user;
    }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
    await logout();
});

export const fetchMe = createAsyncThunk("auth/fetchMe", async () => {
    return getMe();
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; })
            .addCase(loginUser.rejected, (state, action) => { state.isLoading = false; state.error = action.error.message ?? "Login failed"; })
            .addCase(logoutUser.fulfilled, (state) => { state.user = null; })
            .addCase(fetchMe.fulfilled, (state, action) => { state.user = action.payload; });
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
