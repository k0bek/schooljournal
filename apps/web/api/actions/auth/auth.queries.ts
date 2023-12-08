import axios, { AxiosInstance } from 'axios';
import { UserProps } from './../../../../../packages/lib/types';

export const postGoogleAuth = async (user: UserProps) => {
	try {
		await axios.post('/api/v1/auth/google', { user });
	} catch (error) {
		throw error;
	}
};
