'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { onClose, onOpen } from '../../../redux/slices/modalSlice';
import { useEffect } from 'react';
import { WelcomeHeading } from './_components/welcome-heading';
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

	return (
		<main className="w-full px-5 py-1 lg:ml-64 lg:py-5">
			{currentUser?.type === 'student' && (
				<>
					<WelcomeHeading />
					{!currentStudent?.classId && <AvailableClasses currentStudent={currentStudent} />}
				</>
			)}
			{currentUser?.type === 'teacher' && (
				<>
					<WelcomeHeading />
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
