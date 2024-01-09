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
	const user = await db.user.findUnique({ where: { email } });
	let refreshToken = '';

	if (user) {
		const token = createJWT({ payload: { user } });
		const existingToken = await db.token.findFirst({
			where: {
				userId: id,
			},
		});

		if (user?.authType === 'register') {
			throw new BadRequestError(
				'This email is already associated with a normal registration. Please use a different email address for registration.',
			);
		}
		if (existingToken) {
			const { isValid } = existingToken;
			if (!isValid) {
				throw new BadRequestError('Invalid Credentials');
			}
			refreshToken = existingToken.refreshToken;
			attachCookiesToResponse({ res, user, refreshToken });
			return res.status(StatusCodes.OK).json({ user, token });
		} else {
			refreshToken = crypto.randomBytes(40).toString('hex');
			await db.token.create({
				data: {
					userId: user.id,
					refreshToken,
					isValid: true,
				},
			});
			attachCookiesToResponse({ res, user, refreshToken });
			return res.status(StatusCodes.OK).json({ user, token });
		}
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
				type: 'null',
				authType: 'google',
				verified: true,
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
		return res.status(StatusCodes.OK).json({ user, token });
	}
};

export const register = async (req: Request, res: Response) => {
	const { username, email, password, type } = req.body;
	let refreshToken = '';

	if (!username || !email || !password) {
		throw new BadRequestError("Invalid input data'");
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
		select: {
			id: true,
			username: true,
			email: true,
			firstName: true,
			lastName: true,
			password: true,
			imageUrl: true,
			type: true,
			authType: true,
			verified: true,
			createdAt: true,
			updatedAt: true,
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
};

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	let refreshToken = '';

	if (!email || !password) {
		throw new BadRequestError('Please provide email and password.');
	}

	const user = await db.user.findUnique({ where: { email } });

	if (user?.authType === 'google') {
		throw new UnauthenticatedError(
			'This email is already associated with a google account. Please use a different email address for registration.',
		);
	}

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
};

export const verifyEmail = async (req: Request, res: Response) => {
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
};

export const logout = async (req: Request, res: Response) => {
	const { userId } = req.body;
	const existingToken = await db.token.findFirst({
		where: {
			userId,
		},
	});

	if (!existingToken) {
		throw new BadRequestError('Invalid link.');
	}

	await db.token.delete({
		where: {
			id: existingToken.id,
		},
	});

	res.cookie('accessToken', 'logout', {
		httpOnly: true,
		expires: new Date(Date.now()),
	});
	res.cookie('refreshToken', 'logout', {
		httpOnly: true,
		expires: new Date(Date.now()),
	});
	res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};
