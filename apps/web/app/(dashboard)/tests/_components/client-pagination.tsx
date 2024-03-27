'use client';

import { useState } from 'react';
import { PaginationSection } from './pagination-section';
import { Button } from 'ui';
import { useDispatch, useSelector } from 'react-redux';
import { onOpen } from '../../../../redux/slices/modalSlice';
import { assignTestDate } from '../../../../redux/slices/addTestSlice';
import { CreatedTest } from './createdTest';
import { useQuery } from '@tanstack/react-query';
import { getTests } from '../../../../api/actions/tests/tests.queries';
import { RootState } from '../../../../redux/store';

interface ClientPaginationProps {
	choosedClassId: string;
}

export const ClientPagination = ({ choosedClassId }: ClientPaginationProps) => {
	const { currentUser } = useSelector((state: RootState) => state.user);

	const dispatch = useDispatch();
	const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const days = [];
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();
	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const lastPostIndex = currentPage * itemsPerPage;
	const firstPostIndex = lastPostIndex - itemsPerPage;

	for (let i = 1; i <= daysInMonth; i++) {
		const currentDay = new Date(currentYear, currentMonth, i);
		const dayOfWeek = currentDay.getDay();

		if (dayOfWeek !== 0 && dayOfWeek !== 6) {
			days.push({
				currentDate: currentDay.toLocaleDateString(),
				currentDay: weekdays[dayOfWeek],
			});
		}
	}

	const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
	const firstDayOfWeek = firstDayOfMonth.getDay();
	const daysToAdd = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
	for (let i = 0; i < daysToAdd; i++) {
		const prevMonthDay = new Date(currentYear, currentMonth, -i);
		days.unshift({
			currentDate: prevMonthDay.toLocaleDateString(),
			currentDay: weekdays[prevMonthDay.getDay()],
		});
	}

	const currentItems = days.slice(firstPostIndex, lastPostIndex);

	const { data } = useQuery({
		queryKey: ['tests'],
		queryFn: getTests,
	});
	const tests = data?.tests;

	return (
		<div className="grid grid-cols-1 grid-rows-7 gap-4">
			{currentItems.map(item => {
				return (
					<div
						key={item.currentDate}
						className="flex items-center justify-between rounded-md bg-violet-200 px-3 py-5"
					>
						{item.currentDay} {item.currentDate}
						<div className="ml-auto mr-5 flex flex-col items-center gap-2 md:flex-row">
							{tests?.map(test => {
								if (test.testDate === item.currentDate && choosedClassId === test.classId) {
									return (
										<CreatedTest
											className={test?.className}
											topic={test?.topic}
											subjectName={test.subjectName}
											key={test.id}
										/>
									);
								}
							})}
						</div>
						{currentUser?.type === 'teacher' && (
							<Button
								onClick={() => {
									dispatch(onOpen('addTest'));
									dispatch(assignTestDate(item?.currentDate));
								}}
							>
								Add test
							</Button>
						)}
					</div>
				);
			})}
			<PaginationSection
				totalItems={days.length}
				itemsPerPage={itemsPerPage}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
		</div>
	);
};
