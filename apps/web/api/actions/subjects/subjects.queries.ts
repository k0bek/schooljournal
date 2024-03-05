import axios from 'axios';

export const getSubjects = async ({ currentClassId }: { currentClassId: string }) => {
	console.log(currentClassId);
	try {
		return (await axios.get(`/api/v1/subjects/getSubjects/${currentClassId}`)).data;
	} catch (error) {
		throw error;
	}
};
