import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import express from 'express';
import { urlencoded } from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { RateLimitRequestHandler, rateLimit } from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/connectToDatabase';
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
import classRouter from './routes/classRoutes';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware';
import { notFound } from './middleware/notFound';

const app = express();

const limiter: RateLimitRequestHandler = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});
app.set('trust proxy', 1);
app.use(morgan('tiny'));
app.use(helmet());
app.use(cors());
app.use(limiter);

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/class', classRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port: string | 5001 = process.env['PORT'] || 5001;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL as string);
		app.listen(port, () => console.log(`Server is listening on port ${port}...`));
	} catch (error) {
		console.log(error);
	}
};

start();
