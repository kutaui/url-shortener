import axios from 'axios'

export const LoginRequest = (form: UserLoginType) => axios.post(`/login`, form)

export const RegisterRequest = (form: UserRegisterType) =>
	axios.post(`/register`, form)

export const LogoutRequest = () => axios.get(`/logout`)
