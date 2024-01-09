import * as z from 'zod';

export const formSchema = z.object({
	className: z.string().min(1, { message: 'You have to add class name to create a class.' }),
	numberOfStudents: z
		.number()
		.min(1, { message: 'You have to add number of students to create a class.' }),
	subjects: z.enum(
		[
			'maths',
			'english',
			'biology',
			'geography',
			'pe',
			'german',
			'computer science',
			'history',
			'music',
		],
		{
			required_error: 'You need to choose subjects to learn for your students.',
		},
	),
});
