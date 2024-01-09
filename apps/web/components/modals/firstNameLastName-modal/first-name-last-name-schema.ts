import * as z from 'zod';

export const formSchema = z.object({
	firstName: z
		.string()
		.min(1, { message: "It's obligatory to add a name to continue using our app." }),
	lastName: z
		.string()
		.min(1, { message: "It's obligatory to add a surnname to continue using our app." }),
	type: z.enum(['student', 'teacher'], {
		required_error: 'You need to choose your role.',
	}),
});
