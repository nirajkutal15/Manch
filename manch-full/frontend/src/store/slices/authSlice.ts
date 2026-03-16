import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '@/services'
import type { UserDto } from '@/types'
interface AuthState { user: UserDto|null; accessToken: string|null; loading: boolean; error: string|null; }
const initial: AuthState = { user:null, accessToken:localStorage.getItem('accessToken'), loading:false, error:null }
export const login = createAsyncThunk('auth/login', async ({email,password}:{email:string,password:string}, {rejectWithValue}) => {
  try {
    const data = await authService.login(email, password)
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    return data
  } catch(e:any) { return rejectWithValue(e?.response?.data?.message ?? 'Login failed') }
})
export const loadMe = createAsyncThunk('auth/me', async () => authService.me())
const authSlice = createSlice({
  name: 'auth', initialState: initial,
  reducers: {
    logout(state) { state.user=null; state.accessToken=null; localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); },
    setUser(state,action) { state.user=action.payload; },
  },
  extraReducers: b => {
    b.addCase(login.pending, s => { s.loading=true; s.error=null; })
    .addCase(login.fulfilled, (s,a) => { s.loading=false; s.user=a.payload.user; s.accessToken=a.payload.accessToken; })
    .addCase(login.rejected, (s,a) => { s.loading=false; s.error=a.payload as string; })
    .addCase(loadMe.fulfilled, (s,a) => { s.user=a.payload; })
  }
})
export const { logout, setUser } = authSlice.actions
export default authSlice.reducer
