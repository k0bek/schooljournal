import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
const errorHandlerMiddleware = (err: any, req: Request, res: Response) => {
	// console.log(err);
	let customError = {
		// set default
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || 'Something went wrong try again later',
	};
	return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
