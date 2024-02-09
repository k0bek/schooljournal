import { NextFunction, Request, Response } from 'express';
import { db } from '../../../../packages/database/db';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request';
import { User } from '@prisma/client';

interface MessageRequest extends Request {
	user?: User;
}

export const getAllMessages = async (req: MessageRequest, res: Response, next: NextFunction) => {
	try {
		const { memberTwoId, message } = req.body;

		const messages = await db.message.findMany({
			where: {
				OR: [
					{
						memberTwoId: req?.user?.id,
						memberOneId: memberTwoId,
					},
					{
						memberOneId: req?.user?.id,
						memberTwoId: memberTwoId,
					},
				],
				text: message,
			},
			orderBy: {
				updatedAt: 'asc',
			},
			include: {
				memberOne: true,
				memberTwo: true,
			},
		});

		return res.status(StatusCodes.OK).json({ messages });
	} catch (error) {
		next(error);
	}
};
export const addMessage = async (req: MessageRequest, res: Response, next: NextFunction) => {
	try {
		const { memberTwoId, message } = req.body;

		if (!req.user?.id) {
			throw new BadRequestError('Internal error');
		}

		const createdMessage = await db.message.create({
			data: {
				memberTwoId,
				memberOneId: req.user.id,
				text: message,
			},
		});

		if (req.user.initialized) {
			return res.status(StatusCodes.OK).json({ createdMessage });
		}

		const initializedUser = await db.user.update({
			where: {
				id: req.user.id,
			},
			data: {
				initialized: true,
			},
		});
		return res.status(StatusCodes.OK).json({ createdMessage, initializedUser });
	} catch (error) {
		next(error);
	}
};
