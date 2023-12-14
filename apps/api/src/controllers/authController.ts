import { db } from './../../../../packages/database/db';
import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { User } from '@prisma/client';
import { attachCookiesToResponse, createJWT } from './../utils/jwt';
import UnauthenticatedError from '../errors/unauthenticated';
import crypto from 'crypto';
import BadRequestError from '../errors/bad-request';

export const google = async (req: Request, res: Response) => {
	const { user } = req.body;
	const { id, email, imageUrl, username } = user;
	try {
		const user = await db.user.findUnique({ where: { email } });
		let refreshToken = '';

		if (user) {
			const payload = { user };
			const token = createJWT({ payload });
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
			refreshToken = crypto.randomBytes(40).toString('hex');
			const generatedPassword =
				Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
			const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

			const user: User = await db.user.create({
				data: {
					username,
					email,
					firstName: '',
					lastName: '',
					password: hashedPassword,
					imageUrl,
				},
			});
			const token = createJWT({ payload: { user } });
			attachCookiesToResponse({ res, user, refreshToken });
			res.status(StatusCodes.OK).json({ user: token });
		}
	} catch (error) {
		console.log(error);
	}
};

export const register = async (req: Request, res: Response) => {
	const { username, email, password } = req.body;
	let refreshToken = '';

	if (!username || !email || !password) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid input data' });
	}

	const doesEmailAlreadyExist = await db.user.findUnique({ where: { email } });
	const doesUsernameAlreadyExist = await db.user.findFirst({ where: { username } });

	if (doesEmailAlreadyExist) {
		throw new BadRequestError('Email already in use.');
	}
	if (doesUsernameAlreadyExist) {
		throw new BadRequestError('Username already in use.');
	}

	const hashedPassword = await bcryptjs.hash(password, 10);

	try {
		refreshToken = crypto.randomBytes(40).toString('hex');
		const user = await db.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
				firstName: '',
				lastName: '',
			},
		});

		const token = createJWT({ payload: { user } });
		attachCookiesToResponse({ res, user, refreshToken });
		await db.token.create({
			data: {
				userId: user.id,
				refreshToken,
				isValid: true,
			},
		});

		res.status(StatusCodes.CREATED).json({ user: token });
	} catch (error) {
		console.error('Error during user registration:', error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
	}
};

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	let refreshToken = '';

	if (!email || !password) {
		throw new BadRequestError('Please provide email and password.');
	}

	const user = await db.user.findUnique({ where: { email } });

	if (!user) {
		throw new UnauthenticatedError('There is no user with this email.');
	}

	const isPasswordCorrect = await bcryptjs.compareSync(password, user.password);

	if (!isPasswordCorrect) {
		throw new UnauthenticatedError('Invalid password');
	}

	try {
		refreshToken = crypto.randomBytes(40).toString('hex');
		const token = createJWT({ payload: { user } });
		attachCookiesToResponse({ res, user, refreshToken });
		await db.token.create({
			data: {
				userId: user.id,
				refreshToken,
				isValid: true,
			},
		});
		res.status(StatusCodes.CREATED).json({ user: token });
	} catch (error) {
		console.error('Error during user registration:', error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
	}
};
