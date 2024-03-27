import axios from 'axios';

export const getSubjects = async ({ currentClassId }: { currentClassId: string }) => {
	try {
		return (
			await axios.get(`/api/v1/subjects/getSubjects/:currentClassId`, {
				params: { currentClassId },
			})
		).data;
	} catch (error) {
		throw error;
	}
};
