import { db } from '../../../../packages/database/db';
import { Request, Response } from 'express';
import BadRequestError from '../errors/bad-request';
import { User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

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
			subjects,
			formTeacherId: req.user?.id as string,
		},
	});
	res.status(StatusCodes.CREATED).json({ createdClass });
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
		},
	});
	res.status(StatusCodes.OK).json({ classes });
};

export const requestJoinClass = async (req: AuthenticatedRequest, res: Response) => {
	const { classId } = req.body;

	if (!req.user?.id) {
		throw new BadRequestError('There is no user with this id.');
	}

	const requestedClass = await db.class.update({
		where: {
			id: classId,
		},
		data: {
			studentIDs: {
				push: req.user.id,
			},
		},
	});

	console.log(requestedClass);

	const requestedStudent = await db.student.update({
		where: {
			userId: req.user.id,
		},
		data: {
			classIDs: {
				push: classId,
			},
			requestedClasses: {
				connect: {
					id: classId,
				},
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
			formTeacherId: req.user.id,
		},
		include: {
			requestedStudents: true,
		},
	});

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

	await db.class.updateMany({
		data: {
			studentIDs: {
				set: [],
			},
		},
	});

	const acceptedStudent = await db.student.update({
		where: {
			userId: studentId,
		},
		data: {
			classId,
		},
	});

	return res.status(StatusCodes.OK).json({ acceptedStudent });
};

// console.log(updatedClassIds);
