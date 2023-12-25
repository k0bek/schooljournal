import { Response } from 'express';
import jwt, { GetPublicKeyOrSecret, Secret } from 'jsonwebtoken';
import { User } from '@prisma/client';

export const createJWT = ({ payload }: { payload: { user: User; refreshToken?: string } }) => {
	const token = jwt.sign(payload, process.env.JWT_SECRET as string);
	return token;
};

export const isTokenValid = (token: string) => {
	return jwt.verify(token, process.env['JWT_SECRET'] as Secret | GetPublicKeyOrSecret);
};

export const attachCookiesToResponse = ({
	res,
	user,
	refreshToken,
}: {
	res: Response;
	user: User;
	refreshToken: string;
}) => {
	const accessTokenJWT = createJWT({ payload: { user } });
	const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

	const oneDay = 1000 * 60 * 60 * 24;
	const longerExp = 1000 * 60 * 60 * 24 * 30;

	res.cookie('accessToken', accessTokenJWT, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		signed: true,
		expires: new Date(Date.now() + oneDay),
	});

	res.cookie('refreshToken', refreshTokenJWT, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		signed: true,
		expires: new Date(Date.now() + longerExp),
	});
};
