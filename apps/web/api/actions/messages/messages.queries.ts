import axios from 'axios';

export const getAllMessages = async ({ memberTwoId }: { memberTwoId: string }) => {
	try {
		return (await axios.get(`/api/v1/message/getmsg?memberTwoId=${memberTwoId}`)).data;
	} catch (error) {
		throw error;
	}
};

export const createMessage = async ({
	message,
	memberTwoId,
}: {
	message: string;
	memberTwoId: string;
}) => {
	try {
		return await axios.post('/api/v1/message/addmsg', { message, memberTwoId });
	} catch (error) {
		throw error;
	}
};
