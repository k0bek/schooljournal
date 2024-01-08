import { Button } from 'ui';
import { User } from '@prisma/client';

export const AvailableClassesCard = ({
	numberOfStudents,
	className,
	formTeacherFirstName,
	formTeacherLastName,
	students,
}: {
	numberOfStudents: number;
	className: string;
	formTeacherFirstName: string;
	formTeacherLastName: string;
	students: User[];
}) => {
	return (
		<div className="flex flex-col rounded-3xl border-[1px] border-violet-200 bg-violet-100 p-4 lg:max-w-[30rem]">
			<div className="flex flex-col gap-1">
				<span>
					{students.length}/{numberOfStudents} (number of students)
				</span>
				<span className="text-xl font-bold">{className}</span>
				<p>
					Form teacher:{' '}
					<span className="text-violet-600">
						{formTeacherFirstName} {formTeacherLastName}
					</span>
				</p>
			</div>
			<Button variant="outline" className="ml-auto mt-2 w-full md:w-auto">
				Request to join
			</Button>
		</div>
	);
};
