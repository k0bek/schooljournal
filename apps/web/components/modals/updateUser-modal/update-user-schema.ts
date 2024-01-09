import * as z from 'zod';

export const formSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	circle_image: z.string(),
});
