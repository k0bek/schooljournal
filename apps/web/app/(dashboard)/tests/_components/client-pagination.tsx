import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'ui';
import { onOpen } from '../../../../redux/slices/modalSlice';
import { assignTestDate } from '../../../../redux/slices/addTestSlice';
import { getTests } from '../../../../api/actions/tests/tests.queries';
import { RootState } from '../../../../redux/store';
import { CreatedTest } from './createdTest';

interface ClientPaginationProps {
	choosedClassId: string;
}

export const ClientPagination = ({ choosedClassId }: ClientPaginationProps) => {
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state: RootState) => state.user);
	const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	const [currentWeek, setCurrentWeek] = useState(new Date());

	const calculateCurrentWeekDays = date => {
		const first = date.getDate() - date.getDay() + 1; // Pierwszy dzień tygodnia (poniedziałek)
		let days = [];
		for (let i = 0; i < 7; i++) {
			let day = new Date(date.getFullYear(), date.getMonth(), first + i);
			if (day.getDay() !== 0 && day.getDay() !== 6) {
				// Wykluczenie soboty (6) i niedzieli (0)
				days.push({
					currentDate: day.toLocaleDateString(),
					currentDay: weekdays[day.getDay()],
				});
			}
		}
		return days;
	};

	const currentItems = calculateCurrentWeekDays(currentWeek);

	const goToNextWeek = () => {
		setCurrentWeek(
			new Date(currentWeek.getFullYear(), currentWeek.getMonth(), currentWeek.getDate() + 7),
		);
	};

	const goToPreviousWeek = () => {
		setCurrentWeek(
			new Date(currentWeek.getFullYear(), currentWeek.getMonth(), currentWeek.getDate() - 7),
		);
	};

	const { data } = useQuery({
		queryKey: ['tests'],
		queryFn: getTests,
	});
	const tests = data?.tests;

	return (
		<div>
			<div className="grid grid-cols-1 grid-rows-7 gap-4">
				{currentItems.map(item => (
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
								return null;
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
				))}
				<div className="my-4 flex justify-between">
					<Button onClick={goToPreviousWeek}>Previous Week</Button>
					<Button onClick={goToNextWeek}>Next Week</Button>
				</div>
			</div>
		</div>
	);
};
