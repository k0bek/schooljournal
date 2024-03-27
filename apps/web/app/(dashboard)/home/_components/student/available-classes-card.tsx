'use client';

import { Button } from 'ui';
import { User } from '@prisma/client';
import { CiCircleInfo } from 'react-icons/ci';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../../../../../../../packages/ui/components/ui/tooltip';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { requestJoinClass } from '../../../../../api/actions/class/class.queries';
import { useEffect, useState } from 'react';
import { cn } from 'ui/lib/utils';
import { Student, Subject, Class } from '@prisma/client';

interface ExtendedStudent extends Student {
	requestedClasses: Class[];
}

export const AvailableClassesCard = ({
	numberOfStudents,
	className,
	formTeacherFirstName,
	formTeacherLastName,
	subjects,
	students,
	classId,
	currentStudent,
}: {
	numberOfStudents: number;
	className: string;
	formTeacherFirstName: string;
	formTeacherLastName: string;
	subjects: Subject[];
	students: Student[];
	classId: string;
	currentStudent: Student;
}) => {
	const [isClassRequested, setIsClassRequested] = useState(false);
	const queryClient = useQueryClient();
	const currentStudentExtended = currentStudent as ExtendedStudent;

	const { mutate: requestJoinClassMutate } = useMutation({
		mutationFn: requestJoinClass,
		mutationKey: ['requestJoinClass'],
	});

	useEffect(() => {
		setIsClassRequested(false);
		if (currentStudentExtended.requestedClasses.find(classItem => classItem.id === classId)) {
			setIsClassRequested(true);
		}
	}, [currentStudent]);

	const handleRequestJoinClass = async () => {
		queryClient.invalidateQueries({ queryKey: ['classes'] });
		setIsClassRequested(true);
		requestJoinClassMutate({ classId });
	};

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
										{subjects?.map((subject: Subject) => (
											<li key={subject?.subjectName}>- {subject?.subjectName}</li>
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
			<Button
				variant="outline"
				className={cn('ml-auto mt-2 w-full md:w-auto', isClassRequested && 'bg-slate-300')}
				onClick={handleRequestJoinClass}
				disabled={isClassRequested}
			>
				Request to join
			</Button>
		</div>
	);
};
