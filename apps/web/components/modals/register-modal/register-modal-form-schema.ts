import * as z from 'zod';

export const formSchema = z.object({
	username: z
		.string()
		.min(3, {
			message: 'Username must have at least 3 characters',
		})
		.max(50, {
			message: 'Username cannot exceed 50 characters',
		}),
	email: z
		.string()
		.min(1, { message: 'This field has to be filled.' })
		.email('This is not a valid email.'),
	password: z
		.string()
		.min(8, {
			message: 'Password must be at least 8 characters long',
		})
		.max(50, {
			message: 'Password cannot exceed 50 characters',
		})
		.refine(
			data => {
				const hasDigit = /\d/.test(data);
				const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(data);

				return hasDigit && hasSpecialChar;
			},
			{
				message: 'Password must contain at least one digit and one special character',
			},
		),
});
