import { NextFunction, Request, Response } from 'express';
import { db } from '../../../../packages/database/db';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request';
import { User } from '@knocklabs/node';
var ObjectID = require('bson-objectid');

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
				memberOneId: ObjectID(req.user.id),
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
					memberTwoId: ObjectID(''),
				},
			});
			const initializedUser = await db.user.update({
				where: {
					id: ObjectID(req.user.id),
				},
				data: {
					initialized: true,
				},
			});
			return res.status(StatusCodes.OK).json({ createdNotification, initializedUser });
		}

		const createdNotification = await db.notification.create({
			data: {
				memberTwoId: ObjectID(memberTwoId),
				memberOneId: ObjectID(memberOneId),
				text,
				url,
			},
		});

		const initializedUser = await db.user.update({
			where: {
				id: ObjectID(req.user.id),
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
				id: ObjectID(id),
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
