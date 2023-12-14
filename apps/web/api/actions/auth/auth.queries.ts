import axios, { AxiosInstance } from 'axios';
import { UserProps } from './../../../../../packages/lib/types';

export const postGoogleAuth = async (user: UserProps) => {
	try {
		await axios.post('/api/v1/auth/google', { user });
	} catch (error) {
		throw error;
	}
};

export const postRegister = async ({
	username,
	email,
	password,
}: {
	username: string;
	email: string;
	password: string;
}) => {
	try {
		await axios.post('/api/v1/auth/register', { username, email, password });
	} catch (error) {
		throw error;
	}
};

export const postLogin = async ({ email, password }: { email: string; password: string }) => {
	try {
		await axios.post('/api/v1/auth/login', { email, password });
	} catch (error) {
		throw error;
	}
};
