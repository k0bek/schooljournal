'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useQuery } from '@tanstack/react-query';
import { showCurrentStudent } from '../../../../api/actions/user/user.queries';

export const WelcomeHeading = () => {
	const { currentUser } = useSelector((state: RootState) => state.user);
	const { data } = useQuery({
		queryKey: ['currentStudent'],
		queryFn: showCurrentStudent,
	});
	const currentStudent = data?.currentStudent;
	const messageType = {
		studentWithoutClass: 'You are not assigned to any class.',
		greetings: 'Have a nice day!',
	};
	return (
		<header>
			<p className="flex flex-col text-3xl font-semibold lg:text-5xl">
				Hello {currentUser?.firstName},
				<span className="text-violet-500">
					{currentUser.type === 'student' && !currentStudent?.class
						? messageType.studentWithoutClass
						: messageType.greetings}
				</span>
			</p>
		</header>
	);
};
