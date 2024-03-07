import * as z from 'zod';

export const formSchema = z.object({
	class: z.string({
		required_error: 'You need to choose class to add test.',
	}),
	topic: z.string().min(1, { message: 'You have to add test topic!' }),
	subject: z.string({
		required_error: 'You need to choose subject to add test.',
	}),
});
