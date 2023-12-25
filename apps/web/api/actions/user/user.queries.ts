import axios from 'axios';

export const showCurrentUser = async () => {
	try {
		return (await axios.get('/api/v1/user/showMe')).data;
	} catch (error) {
		throw error;
	}
};

export const updateUser = async ({
	firstName,
	lastName,
	email,
}: {
	firstName: string;
	lastName: string;
	email: string;
}) => {
	try {
		return await axios.patch('/api/v1/user/updateUser', { email, firstName, lastName });
	} catch (error) {
		throw error;
	}
};
