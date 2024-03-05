'use client';

import { GradesTableTeacher } from './_components/teacher/grades-table';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { SelectClass } from './_components/teacher/select-class';
import { SelectStudent } from './_components/teacher/select-student';
import { useQuery } from '@tanstack/react-query';
import { getClasses } from '../../../api/actions/class/class.queries';
import { useCallback, useState } from 'react';
import { GradesTableStudent } from './_components/student/grades-table';
import { Button } from 'ui';
import { onOpen } from '../../../redux/slices/modalSlice';
import { assignStudentGradeId } from '../../../redux/slices/addGradeSlice';

const GradesPage = () => {
	const [classStudents, setClassStudents] = useState([]);
	const [currentClass, setCurrentClass] = useState(null);
	const [currentStudentSubjects, setCurrentStudentSubjects] = useState([]);
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state: RootState) => state.user);

	const { data } = useQuery({
		queryKey: ['classes'],
		queryFn: getClasses,
	});
	const classes = data?.classes;

	const selectClassToSearch = useCallback(
		(className: string) => {
			const choosedClass = classes.find(classItem => classItem.className === className);
			const choosedClassStudents = choosedClass?.students;
			if (choosedClassStudents.length === 0) {
				setClassStudents([]);
			} else {
				choosedClassStudents.map(student => {
					setClassStudents(prev => [
						{
							firstName: student?.user.firstName,
							lastName: student?.user.lastName,
							id: student.id,
						},
					]);
				});
				setCurrentClass(choosedClass);
			}
		},
		[classes],
	);

	const selectStudentToSearch = useCallback(
		(studentId: string) => {
			const { subjects } = currentClass;
			const subjectsWithUpgradedGrades = subjects.map(subject => {
				return {
					...subject,
					grades: subject.grades.filter(grade => grade.studentId === studentId),
				};
			});

			const subjectsWithNameAndId = subjectsWithUpgradedGrades.map(subject => {
				return { subjectName: subject.subjectName, id: subject.id };
			});

			dispatch(assignStudentGradeId({ subjectsWithNameAndId, studentId }));
			setCurrentStudentSubjects(subjectsWithUpgradedGrades);
		},
		[currentClass],
	);

	const openAddGradeModal = useCallback(() => {
		dispatch(onOpen('addGrade'));
	}, []);

	return (
		<div className="w-full flex-col px-5 pb-20 lg:ml-64 lg:flex lg:gap-12 lg:py-5">
			<p className="text-3xl font-semibold lg:text-5xl">
				Your{' '}
				<span className="text-violet-500">
					{currentUser?.type === 'student' ? 'grades' : 'students grades'}
				</span>
			</p>
			{currentUser?.type === 'teacher' && (
				<div className="mt-3 flex w-min flex-col gap-3">
					<SelectClass selectClassToSearch={selectClassToSearch} />
					<SelectStudent
						classStudents={classStudents}
						selectStudentToSearch={selectStudentToSearch}
					/>
					<Button
						variant="default"
						onClick={openAddGradeModal}
						disabled={currentStudentSubjects.length === 0}
					>
						Add grade
					</Button>
				</div>
			)}
			{currentUser?.type === 'teacher' && currentStudentSubjects.length !== 0 && (
				<GradesTableTeacher currentClassId={currentClass?.id} />
			)}
			{currentUser?.type === 'student' && <GradesTableStudent />}
		</div>
	);
};

export default GradesPage;
