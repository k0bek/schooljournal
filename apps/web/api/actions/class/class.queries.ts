import axios from 'axios';

export const createClass = async ({
	className,
	numberOfStudents,
	subjects,
}: {
	className: string;
	numberOfStudents: number;
	subjects: string[];
}) => {
	try {
		return await axios.post('/api/v1/class/createClass', { className, numberOfStudents, subjects });
	} catch (error) {
		throw error;
	}
};

export const getClasses = async () => {
	try {
		return (await axios.get('/api/v1/class/getClasses')).data;
	} catch (error) {
		throw error;
	}
};

export const requestJoinClass = async ({ classId }: { classId: string }) => {
	try {
		return await axios.patch('/api/v1/class/requestJoinClass', { classId });
	} catch (error) {
		throw error;
	}
};

export const getRequestedStudents = async () => {
	try {
		return (await axios.get('/api/v1/class/getRequestedStudents')).data;
	} catch (error) {
		throw error;
	}
};

export const acceptStudent = async ({
	studentId,
	classId,
}: {
	studentId: string;
	classId: string;
}) => {
	try {
		return await axios.patch('/api/v1/class/acceptStudent', { studentId, classId });
	} catch (error) {
		throw error;
	}
};
