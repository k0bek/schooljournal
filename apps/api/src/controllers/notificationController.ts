import { NextFunction, Request, Response } from 'express';
import { db } from '../../../../packages/database/db';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request';
import { User } from '@knocklabs/node';

interface NotificationRequest extends Request {
	user?: User;
}

export const getAllNotifications = async (
	req: NotificationRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.user?.id) {
			throw new BadRequestError('There is no user with this id.');
		}

		const notifications = await db.notification.findMany({
			where: {
				memberOneId: req.user.id,
			},
			orderBy: {
				updatedAt: 'asc',
			},
			include: {
				memberOne: true,
			},
		});

		return res.status(StatusCodes.OK).json({ notifications });
	} catch (error) {
		next(error);
	}
};
export const createNotification = async (
	req: NotificationRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { text, url, memberTwoId, memberOneId } = req.body;

		if (!req.user?.id) {
			throw new BadRequestError('There is no user with this id.');
		}

		if (!memberTwoId) {
			const createdNotification = await db.notification.create({
				data: {
					memberOneId,
					text,
					url,
					memberTwoId: '',
				},
			});
			const initializedUser = await db.user.update({
				where: {
					id: req.user.id,
				},
				data: {
					initialized: true,
				},
			});
			return res.status(StatusCodes.OK).json({ createdNotification, initializedUser });
		}

		const createdNotification = await db.notification.create({
			data: {
				memberTwoId,
				memberOneId,
				text,
				url,
			},
		});

		const initializedUser = await db.user.update({
			where: {
				id: req.user.id,
			},
			data: {
				initialized: true,
			},
		});

		return res.status(StatusCodes.OK).json({ createdNotification, initializedUser });
	} catch (error) {
		next(error);
	}
};

export const markReadNotification = async (
	req: NotificationRequest,
	res: Response,
	next: NextFunction,
) => {
	const { id } = req.body;
	try {
		const notifications = await db.notification.update({
			where: {
				id,
			},
			data: {
				readed: true,
			},
		});

		return res.status(StatusCodes.OK).json({ notifications });
	} catch (error) {
		next(error);
	}
};
