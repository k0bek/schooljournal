import axios from 'axios';

export const postGoogleAuth = async ({
	id,
	email,
	imageUrl,
	username,
}: {
	id: string;
	email: string;
	imageUrl: string;
	username: string;
}) => {
	try {
		return await axios.post('/api/v1/auth/google', { id, email, imageUrl, username });
	} catch (error) {
		throw error;
	}
};

export const postRegister = async ({
	username,
	email,
	password,
	type,
}: {
	username: string;
	email: string;
	password: string;
	type: string;
}) => {
	try {
		return await axios.post('/api/v1/auth/register', { username, email, password, type });
	} catch (error) {
		throw error;
	}
};

export const postLogin = async ({ email, password }: { email: string; password: string }) => {
	try {
		return await axios.post('/api/v1/auth/login', { email, password });
	} catch (error) {
		throw error;
	}
};

export const postVerifyAccount = async ({
	userId,
	tokenId,
}: {
	userId: string | string[];
	tokenId: string | string[];
}) => {
	try {
		return await axios.post(`/api/v1/auth/users/${userId}/verify/${tokenId}`, { userId, tokenId });
	} catch (error) {
		throw error;
	}
};

export const logout = async ({ userId }: { userId: string }) => {
	try {
		return await axios.post('/api/v1/auth/logout', { userId });
	} catch (error) {
		throw error;
	}
};
