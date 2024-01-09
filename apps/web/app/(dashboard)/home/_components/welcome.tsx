'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

const Welcome = () => {
	const { currentUser } = useSelector((state: RootState) => state.user);
	const messageType = {
		student: 'You are not assigned to any class.',
	};
	return (
		<header>
			<p className="flex flex-col text-3xl font-semibold lg:text-5xl">
				Hello {currentUser?.firstName},
				<span className="text-violet-500">
					{currentUser.type === 'student' && messageType.student}
				</span>
			</p>
		</header>
	);
};

export default Welcome;
