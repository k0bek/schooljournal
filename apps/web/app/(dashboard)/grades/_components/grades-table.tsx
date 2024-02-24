'use client';

import { QueryClient, useQuery } from '@tanstack/react-query';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../../../../../packages/ui/components/ui/table';
import { getClass, getClasses } from '../../../../api/actions/class/class.queries';
import { Grade } from '@prisma/client';

export const GradesTable = () => {
	const { data } = useQuery({
		queryKey: ['class'],
		queryFn: getClass,
	});
	const currentClass = data?.currentClass;
	const currentClasSubjects = currentClass?.subjects;

	const countGradesAverage = (grades: Grade[]) => {
		const integerGrades = grades?.map(grade => grade.grade);
		const gradesSum = integerGrades?.reduce((a: number, b: number) => a + b);
		const gradesAverage = gradesSum / grades.length;
		return Math.round(gradesAverage * 10) / 10;
	};

	return (
		<main>
			<Table>
				<TableCaption>A list of your grades.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Subject</TableHead>
						<TableHead>Grades</TableHead>
						<TableHead>Average</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentClasSubjects?.map(subject => {
						return (
							<>
								<TableRow>
									<TableCell className="font-medium">
										{subject.subjectName.charAt(0).toUpperCase() + subject.subjectName.slice(1)}
									</TableCell>
									<TableCell>
										{subject?.grades.map((grade, index) => {
											if (index !== subject.grades.length - 1) {
												return grade.grade + ',';
											} else {
												return grade.grade;
											}
										})}
										{subject.grades.length === 0 && '-'}
									</TableCell>
									<TableCell>
										{subject.grades && subject.grades.length > 0
											? countGradesAverage(subject.grades)
											: '-'}
									</TableCell>
								</TableRow>
							</>
						);
					})}
				</TableBody>
			</Table>
		</main>
	);
};
