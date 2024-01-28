'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { onClose, onOpen } from '../../../redux/slices/modalSlice';
import { useEffect } from 'react';
import Welcome from './_components/welcome';
import { AvailableClasses } from './_components/student/available-classes';
import { CreateYourClass } from './_components/teacher/create-your-class';

const HomePage = () => {
	const { currentUser } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
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
					<Welcome />
					<AvailableClasses />
				</>
			)}
			{currentUser?.type === 'teacher' && (
				<>
					<Welcome />
					<CreateYourClass />
				</>
			)}
		</main>
	);
};

export default HomePage;
