import axios from 'axios';

export const addGrade = async ({
	grade,
	topic,
	studentId,
	subjectId,
}: {
	grade: number;
	topic: string;
	studentId: string;
	subjectId: string;
}) => {
	try {
		return await axios.post('/api/v1/grades/addGrade', { grade, topic, studentId, subjectId });
	} catch (error) {
		throw error;
	}
};
