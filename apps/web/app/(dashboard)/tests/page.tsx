'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { ClientPagination } from './_components/client-pagination';
import { SelectClass } from './_components/select-class';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { showCurrentStudent } from '../../../api/actions/user/user.queries';

const TestsPage = () => {
	const { data } = useQuery({
		queryKey: ['currentStudent'],
		queryFn: showCurrentStudent,
	});
	const currentStudent = data?.currentStudent;

	const { currentUser } = useSelector((state: RootState) => state.user);
	const [choosedClassId, setChoosedClassId] = useState(null);

	useEffect(() => {
		if (currentUser.type == 'student') {
			setChoosedClassId(currentStudent?.classId);
		}
	}, [currentStudent]);

	return (
		<div className="w-full flex-col px-5 pb-20 lg:ml-64 lg:flex lg:gap-12 lg:py-5">
			<p className="text-3xl font-semibold lg:text-5xl">
				Your{' '}
				<span className="text-violet-500">
					{currentUser?.type === 'student' ? 'tests' : 'students tests'}
				</span>
			</p>
			{currentUser.type === 'teacher' && <SelectClass setChoosedClassId={setChoosedClassId} />}
			{(currentUser.type === 'student' || choosedClassId) && (
				<ClientPagination choosedClassId={choosedClassId} />
			)}
		</div>
	);
};

export default TestsPage;
