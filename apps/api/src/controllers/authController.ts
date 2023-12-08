import { db } from './../../../../packages/database/db';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { User } from '@prisma/client';
import { attachCookiesToResponse, createJWT } from './../utils/jwt';
import UnauthenticatedError from '../errors/unauthenticated';
import crypto from 'crypto';

export const google = async (req: Request, res: Response) => {
	const { user } = req.body;
	const { id, email, imageUrl } = user;
	try {
		const user = await db.user.findUnique({ where: { email } });

		if (user) {
			const payload = { user };
			const token = createJWT({ payload });
			let refreshToken = '';
			const existingToken = await db.token.findFirst({
				where: {
					userId: id,
				},
			});
			if (existingToken) {
				const { isValid } = existingToken;
				if (!isValid) {
					throw new UnauthenticatedError('Invalid Credentials');
				}
				refreshToken = existingToken.refreshToken;
				attachCookiesToResponse({ res, user, refreshToken });
				res.status(StatusCodes.OK).json({ user: token });
				return;
			} else {
				refreshToken = crypto.randomBytes(40).toString('hex');
				await db.token.create({
					data: {
						userId: id,
						refreshToken,
						isValid: true,
					},
				});
				attachCookiesToResponse({ res, user, refreshToken });
				res.status(StatusCodes.OK).json({ user: token });
			}
		} else {
			const generatedPassword =
				Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
			const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

			const user: User = await db.user.create({
				data: {
					id,
					email,
					firstName: '',
					lastName: '',
					password: hashedPassword,
					imageUrl,
				},
			});
			const token: string = jwt.sign({ id }, process.env.JWT_SECRET as string);
			res.cookie('access_token', token, { httpOnly: true }).status(StatusCodes.OK).json(user);
		}
	} catch (error) {
		console.log(error);
	}
};
