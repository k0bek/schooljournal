import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from 'ui/components/ui/table';
import { Grade } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { getSubjects } from '../../../../../api/actions/subjects/subjects.queries';

interface GradesTableProps {
	currentClassId: string;
}

export const GradesTableTeacher = ({ currentClassId }: GradesTableProps) => {
	const { data } = useQuery({
		queryKey: ['subjects', currentClassId],
		queryFn: async () => {
			const data = await getSubjects({ currentClassId });
			return data;
		},
	});
	const subjects = data?.subjects;

	const countGradesAverage = (grades: Grade[]) => {
		const integerGrades = grades?.map(grade => grade.grade);
		const gradesSum = integerGrades?.reduce((a: number, b: number) => a + b);
		const gradesAverage = gradesSum / grades.length;
		return Math.round(gradesAverage * 10) / 10;
	};

	return (
		<main className="mt-10 lg:mt-0">
			<Table>
				<TableCaption>A list of grades.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Subject</TableHead>
						<TableHead>Grades</TableHead>
						<TableHead>Average</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{subjects?.map(subject => {
						return (
							<>
								<TableRow>
									<TableCell className="font-medium">
										{subject?.subjectName.charAt(0).toUpperCase() + subject?.subjectName.slice(1)}
									</TableCell>
									<TableCell>
										{subject?.grades.map((grade, index) => {
											if (index !== subject?.grades.length - 1) {
												return grade?.grade + ',';
											} else {
												return grade?.grade;
											}
										})}
										{subject?.grades.length === 0 && '-'}
									</TableCell>
									<TableCell>
										{subject?.grades && subject?.grades.length > 0
											? countGradesAverage(subject?.grades)
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
