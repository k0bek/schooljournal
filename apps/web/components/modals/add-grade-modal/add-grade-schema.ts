import * as z from 'zod';

export const formSchema = z.object({
	topic: z.string().min(1, { message: 'You have to add topic to the grade.' }),
	grade: z.number().min(1, { message: 'You have to add grade!' }),
	subject: z.string({
		required_error: 'You need to choose subject to add grade.',
	}),
});
