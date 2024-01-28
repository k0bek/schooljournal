import { Button } from 'ui';
import { User } from '@prisma/client';
import { CiCircleInfo } from 'react-icons/ci';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../../../../../../../packages/ui/components/ui/tooltip';

export const AvailableClassesCard = ({
	numberOfStudents,
	className,
	formTeacherFirstName,
	formTeacherLastName,
	subjects,
	students,
}: {
	numberOfStudents: number;
	className: string;
	formTeacherFirstName: string;
	formTeacherLastName: string;
	subjects: string[];
	students: User[];
}) => {
	return (
		<div className="flex flex-col rounded-3xl border-[1px] border-violet-200 bg-violet-100 p-4 lg:max-w-[30rem] dark:bg-transparent">
			<div className="flex flex-col gap-1">
				<div className="flex items-center justify-between">
					<span>
						{students.length}/{numberOfStudents} (number of students)
					</span>
					<span>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<CiCircleInfo className="cursor-pointer text-xl font-bold" />
								</TooltipTrigger>
								<TooltipContent>
									<ul>
										Class subjects:
										{subjects.map(subject => (
											<li key={subject}>- {subject}</li>
										))}
									</ul>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</span>
				</div>
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
