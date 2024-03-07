import axios from 'axios';

export const addTest = async ({
	classId,
	subjectName,
	topic,
	testDate,
	className,
}: {
	classId: string;
	subjectName: string;
	topic: string;
	testDate: string;
	className: string;
}) => {
	try {
		return await axios.post('/api/v1/tests/addTest', {
			classId,
			subjectName,
			topic,
			testDate,
			className,
		});
	} catch (error) {
		throw error;
	}
};

export const getTests = async () => {
	try {
		return (await axios.get('/api/v1/tests/getTests')).data;
	} catch (error) {
		throw error;
	}
};
