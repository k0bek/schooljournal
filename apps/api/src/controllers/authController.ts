import { db } from './../../../../packages/database/db';
import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { attachCookiesToResponse, createJWT } from './../utils/jwt';
import UnauthenticatedError from '../errors/unauthenticated';
import crypto from 'crypto';
import BadRequestError from '../errors/bad-request';
import { sendEmail } from './../utils/sendEmail';

export const google = async (req: Request, res: Response) => {
	const { id, email, imageUrl, username } = req.body;
	try {
		const user = await db.user.findUnique({ where: { email } });
		let refreshToken = '';

		if (user?.authType === 'register') {
			throw new BadRequestError(
				'This email is already associated with a regular account registration. Please use a different email address for registration.',
			);
		}

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
				res.status(StatusCodes.OK).json({ user, token });
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
			throw new UnauthenticatedError('There is no user with this email.');
		} else {
			refreshToken = crypto.randomBytes(40).toString('hex');
			refreshToken = crypto.randomBytes(40).toString('hex');
			const generatedPassword =
				Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
			const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

			const user = await db.user.create({
				data: {
					username,
					email,
					firstName: '',
					lastName: '',
					password: hashedPassword,
					imageUrl,
					type: 'student',
					authType: 'google',
					verified: true,
				},
			});
			const token = createJWT({ payload: { user } });
			attachCookiesToResponse({ res, user, refreshToken });
			res.status(StatusCodes.OK).json({ user, token });
		}
	} catch (error) {
		console.log(error);
	}
};

export const register = async (req: Request, res: Response) => {
	const { username, email, password, type } = req.body;
	let refreshToken = '';

	if (!username || !email || !password) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid input data' });
	}

	const user = await db.user.findUnique({ where: { email } });
	const doesEmailAlreadyExist = await db.user.findUnique({ where: { email } });
	const doesUsernameAlreadyExist = await db.user.findFirst({ where: { username } });

	if (doesEmailAlreadyExist) {
		throw new BadRequestError('Email already in use.');
	}
	if (doesUsernameAlreadyExist) {
		throw new BadRequestError('Username already in use.');
	}

	if (user?.authType === 'google') {
		throw new BadRequestError(
			'This email is already associated with a google account. Please use a different email address for registration.',
		);
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
				type,
				authType: 'register',
			},
		});

		const token = createJWT({ payload: { user } });
		await db.token.create({
			data: {
				userId: user.id,
				refreshToken,
				isValid: true,
			},
		});
		const url = `${process.env.BASE_URL}users/${user.id}/verify/${token}`;
		await sendEmail(user.email, 'Verify Email', `Click the link to verify your account: \n${url}`);

		res.status(StatusCodes.CREATED).json({
			token,
			user,
			msg: 'Please confirm your email to complete the registration process and start enjoying our services.',
		});
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

	const isPasswordCorrect = bcryptjs.compareSync(password, user.password);

	if (!isPasswordCorrect) {
		throw new UnauthenticatedError('Invalid password');
	}

	if (!user.verified) {
		let token = await db.token.findFirst({ where: { userId: user.id } });
		const url = `${process.env.BASE_URL}/users/${user.id}/verify/${token}`;
		await sendEmail(user.email, 'Verify Email', url);
		throw new UnauthenticatedError('Your account is not verified. Please check your mail.');
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
		res.status(StatusCodes.CREATED).json({ token, user });
	} catch (error) {
		console.error('Error during user registration:', error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
	}
};

export const verifyEmail = async (req: Request, res: Response) => {
	try {
		const user = await db.user.findUnique({ where: { id: req.params.id } });
		if (!user) {
			throw new BadRequestError('Invalid link.');
		}

		const existingToken = await db.token.findFirst({
			where: {
				userId: user.id,
			},
		});

		if (!existingToken) {
			throw new BadRequestError('Invalid link.');
		}

		const updatedUser = await db.user.update({
			where: { id: req.params.id },
			data: { verified: true },
		});
		await db.token.delete({
			where: {
				id: existingToken.id,
			},
		});

		return res
			.status(StatusCodes.OK)
			.json({ updatedUser, msg: 'Your account is now confirmed. Welcome aboard!' });
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
	}
};
