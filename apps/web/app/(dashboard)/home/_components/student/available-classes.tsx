'use client';

import { useQuery } from '@tanstack/react-query';
import { AvailableClassesCard } from './available-classes-card';
import { getClasses } from '../../../../../api/actions/class/class.queries';

const AvailableClasses = () => {
	const { data, error, isFetched } = useQuery({
		queryKey: ['classes'],
		queryFn: getClasses,
	});
	const classes = data?.classes;

	console.log(classes);

	console.log(classes);
	return (
		<section>
			<h2 className="mt-5 text-2xl font-extralight text-violet-600 lg:mt-10 lg:text-4xl">
				Available <span className="text-black dark:text-white">classes:</span>
			</h2>
			<div className="grid grid-cols-1 gap-4 py-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
				{classes?.map((classItem, index) => (
					<AvailableClassesCard
						key={index}
						className={classItem.classname}
						numberOfStudents={classItem.numberOfStudents}
						formTeacherFirstName={classItem.formTeacher.firstName}
						formTeacherLastName={classItem.formTeacher.lastName}
						students={classItem.students}
					/>
				))}
			</div>
		</section>
	);
};

export default AvailableClasses;
