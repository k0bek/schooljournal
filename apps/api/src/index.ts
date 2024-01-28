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
import { createServer } from 'http';
import { socket } from './socket/chat/chat';
const app = express();
export const httpServer = createServer(app);

const limiter: RateLimitRequestHandler = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
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

const port: string | number = process.env.PORT || 5001;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL as string);
		socket(httpServer);
		httpServer.listen(port, () => console.log(`Server is listening on port ${port}...`));
	} catch (error) {
		console.log(error);
	}
};

start();
