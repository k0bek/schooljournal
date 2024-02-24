'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { onClose, onOpen } from '../../../redux/slices/modalSlice';
import { useEffect } from 'react';
import Welcome from './_components/welcome';
import { AvailableClasses } from './_components/student/available-classes';
import { CreateYourClass } from './_components/teacher/create-your-class';
import { ClassRequests } from './_components/teacher/class-requests';
import { showCurrentStudent } from '../../../api/actions/user/user.queries';
import { useQuery } from '@tanstack/react-query';

const HomePage = () => {
	const dispatch = useDispatch();

	const { currentUser } = useSelector((state: RootState) => state.user);
	const { data, refetch } = useQuery({
		queryKey: ['currentStudent'],
		queryFn: showCurrentStudent,
		initialData: null,
	});
	const currentStudent = data?.currentStudent;

	useEffect(() => {
		refetch();
		if (!currentUser?.firstName || !currentUser?.lastName) {
			dispatch(onOpen('firstNameLastName'));
		} else {
			dispatch(onClose());
		}
	}, []);

	console.log(currentStudent);

	return (
		<main className="w-full px-5 py-1 lg:ml-64 lg:py-5">
			{currentUser?.type === 'student' && (
				<>
					<Welcome />
					{!currentStudent?.classId && <AvailableClasses currentStudent={currentStudent} />}
				</>
			)}
			{currentUser?.type === 'teacher' && (
				<>
					<Welcome />
					<div className="flex flex-col">
						<CreateYourClass />
						<ClassRequests />
					</div>
				</>
			)}
		</main>
	);
};

export default HomePage;
