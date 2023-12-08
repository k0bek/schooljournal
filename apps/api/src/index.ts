import dotenv from 'dotenv';
dotenv.config();
require('express-async-errors');
import express from 'express';
import { urlencoded } from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { RateLimitRequestHandler, rateLimit } from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/connectToDatabase';
import authRouter from './routes/authRoutes';

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));

const limiter: RateLimitRequestHandler = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

app.use(morgan('tiny'));
app.use(cors());
app.use(helmet());
app.use(limiter);

app.set('trust proxy', 1);
app.use('/api/v1/auth', authRouter);

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
