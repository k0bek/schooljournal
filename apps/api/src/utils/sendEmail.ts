import nodemailer from 'nodemailer';

export const sendEmail = async (email: string, subject: string, text: string) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: Number(process.env.EMAIL_PORT),
			secure: Boolean(process.env.SECURE),
			auth: {
				user: process.env.USER_EMAIL,
				pass: process.env.PASS,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		await transporter.sendMail({
			from: process.env.USER_EMAIL,
			to: email,
			subject: subject,
			text: text,
		});
		console.log('email sent successfully');
	} catch (error) {
		console.log(process.env.USER_EMAIL, process.env.PASS);
		console.log('email not sent!');
		console.log(error);
		return error;
	}
};
