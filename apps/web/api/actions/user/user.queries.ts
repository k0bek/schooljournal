import axios from 'axios';

export const showCurrentUser = async () => {
	try {
		return (await axios.get('/api/v1/user/showMe')).data;
	} catch (error) {
		throw error;
	}
};

export const updateUser = async user => {
	try {
		return await axios.patch('/api/v1/user/updateUser', user);
	} catch (error) {
		throw error;
	}
};
