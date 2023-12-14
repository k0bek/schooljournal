import * as z from 'zod';

export const formSchema = z.object({
	email: z.string().min(1, { message: 'This field has to be filled to log in.' }),
	password: z.string().min(1, { message: 'This field has to be filled to log in.' }),
});
