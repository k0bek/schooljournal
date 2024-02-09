import axios from 'axios';

export const getAllNotifications = async () => {
	try {
		return (await axios.get('/api/v1/notification/getnotification')).data;
	} catch (error) {
		throw error;
	}
};

export const createNotification = async ({
	text,
	memberTwoId,
	memberOneId,
	url,
}: {
	text: string;
	memberTwoId?: string;
	memberOneId: string;
	url: string;
}) => {
	try {
		return await axios.post('/api/v1/notification/addnotification', {
			text,
			memberTwoId,
			url,
			memberOneId,
		});
	} catch (error) {
		throw error;
	}
};

export const markReadNotification = async ({ id }: { id: string }) => {
	try {
		return await axios.patch('/api/v1/notification/markreadnotification', { id });
	} catch (error) {
		throw error;
	}
};
