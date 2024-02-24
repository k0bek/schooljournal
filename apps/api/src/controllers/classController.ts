import { db } from '../../../../packages/database/db';
import { Request, Response } from 'express';
import BadRequestError from '../errors/bad-request';
import { User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
var ObjectID = require('bson-objectid');

interface AuthenticatedRequest extends Request {
	user?: User;
}

export const createClass = async (req: AuthenticatedRequest, res: Response) => {
	const { className, numberOfStudents, subjects } = req.body;
	const existingClass = await db.class.findUnique({ where: { className } });

	if (existingClass) {
		throw new BadRequestError('Class with this name already exists.');
	}
	const createdClass = await db.class.create({
		data: {
			className,
			numberOfStudents,
			formTeacherId: ObjectID(req.user?.id) as string,
		},
	});

	const createdSubjects = await Promise.all(
		subjects.map(async (subject: string) => {
			return await db.subject.create({
				data: {
					classId: ObjectID(createdClass.id),
					subjectName: subject,
				},
			});
		}),
	);

	res.status(StatusCodes.CREATED).json({ createdClass, createdSubjects });
};

export const getClasses = async (req: AuthenticatedRequest, res: Response) => {
	const classes = await db.class.findMany({
		include: {
			formTeacher: {
				include: {
					user: true,
				},
			},
			requestedStudents: {
				include: {
					user: true,
				},
			},
			students: {
				include: {
					user: true,
				},
			},
			subjects: {
				include: {
					grades: true,
				},
			},
		},
	});
	res.status(StatusCodes.OK).json({ classes });
};

export const requestJoinClass = async (req: AuthenticatedRequest, res: Response) => {
	const { classId } = req.body;

	if (!req.user?.id) {
		throw new BadRequestError('There is no user with this id.');
	}

	const currentStudent = await db.student.findUnique({
		where: {
			userId: req.user.id,
		},
	});

	console.log(currentStudent);

	const requestedClass = await db.class.update({
		where: {
			id: ObjectID(classId),
		},
		data: {
			studentIDs: {
				push: ObjectID(currentStudent?.id),
			},
		},
	});

	const requestedStudent = await db.student.update({
		where: {
			userId: ObjectID(req.user.id),
		},
		data: {
			classIDs: {
				push: ObjectID(classId),
			},
		},
	});

	res.status(StatusCodes.OK).json({ requestedClass, requestedStudent });
};

export const getRequestedStudents = async (req: AuthenticatedRequest, res: Response) => {
	if (!req.user?.id) {
		throw new BadRequestError('There is no user with this id.');
	}

	const requestedClass = await db.class.findFirst({
		where: {
			formTeacherId: ObjectID(req.user.id),
		},
		include: {
			requestedStudents: true,
		},
	});

	console.log(requestedClass);

	res.status(StatusCodes.OK).json({ requestedClass });
};

export const acceptStudent = async (req: AuthenticatedRequest, res: Response) => {
	const { classId, studentId } = req.body;

	// const studentsToDelete = await db.student.findMany({
	// 	where: {
	// 		requestedClasses: {
	// 			some: {
	// 				id: classId,
	// 			},
	// 		},
	// 	},
	// });

	// const classesToDelete = await db.class.findMany({
	// 	where: {
	// 		requestedStudents: {
	// 			some: {
	// 				id: studentId,
	// 			},
	// 		},
	// 	},
	// });

	// const updatedClassIds = studentsToDelete?.flatMap(requestedStudent =>
	// 	requestedStudent.classIDs.filter(id => id !== classId),
	// );

	// const updatedStudentsIds = classesToDelete?.flatMap(requestedClass =>
	// 	requestedClass.studentIDs.filter((id: string) => id !== studentId),
	// );

	await db.student.updateMany({
		data: {
			classIDs: {
				set: [],
			},
		},
	});

	const existingClass = await db.class.findUnique({
		where: {
			id: ObjectID(classId),
		},
	});

	const currentStudent = await db.student.findUnique({
		where: {
			userId: studentId,
		},
	});

	if (existingClass) {
		const classes = await db.class.findMany();

		for (const classItem of classes) {
			const updatedStudentIDs = classItem.studentIDs.filter(id => id !== currentStudent?.id);

			console.log(updatedStudentIDs);

			await db.class.update({
				where: {
					id: ObjectID(classItem.id),
				},
				data: {
					studentIDs: updatedStudentIDs,
				},
			});
		}
	}

	const acceptedStudent = await db.student.update({
		where: {
			userId: ObjectID(studentId),
		},
		data: {
			classId: ObjectID(classId),
		},
	});

	return res.status(StatusCodes.OK).json({ acceptedStudent });
};

export const getClass = async (req: AuthenticatedRequest, res: Response) => {
	const currentStudent = await db.student.findFirst({
		where: {
			userId: ObjectID(req.user?.id),
		},
	});
	if (!currentStudent?.classId) {
		throw new BadRequestError('There is no user with this id.');
	}
	const currentClass = await db.class.findFirst({
		where: {
			id: ObjectID(currentStudent.classId),
		},
		include: {
			subjects: {
				include: {
					grades: true,
				},
			},
		},
	});
	res.status(StatusCodes.OK).json({ currentClass });
};
