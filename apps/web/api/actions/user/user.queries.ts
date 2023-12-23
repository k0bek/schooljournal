import axios from 'axios';

export const showCurrentUser = async () => {
	try {
		return (await axios.get('/api/v1/user/showMe')).data;
	} catch (error) {
		throw error;
	}
};
