'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { acceptStudent, getClasses } from '../../../../../api/actions/class/class.queries';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { ScrollArea } from 'ui/components/ui/scroll-area';
import { Avatar, AvatarImage } from 'ui/components/ui/avatar';
import { Button } from 'ui';
import { FaCheck } from 'react-icons/fa';

export const ClassRequests = () => {
	const queryClient = useQueryClient();
	const { currentUser } = useSelector((state: RootState) => state.user);

	const { mutate: acceptStudentMutate, isPending } = useMutation({
		mutationFn: acceptStudent,
		mutationKey: ['acceptStudent'],
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['classes'] });
		},
	});

	const { data, refetch: getClassesRefetch } = useQuery({
		queryKey: ['classes'],
		queryFn: getClasses,
	});
	const classes = data?.classes;

	const formTeacherClasses = classes?.filter(
		classItem => classItem.formTeacherId === currentUser.id,
	);

	const handleAcceptStudent = ({ studentId, classId }) => {
		acceptStudentMutate({ studentId, classId });
		getClassesRefetch();
	};

	console.log(classes);

	return (
		<section className="flex w-1/2 flex-col items-start">
			<div className="w-full text-center">
				<h2 className="mt-5 text-3xl font-extralight text-violet-600 md:text-4xl lg:mt-10 lg:text-[2.5rem]">
					Class<span className="text-black dark:text-white"> requests</span>
				</h2>
				<span className="text-xs">
					*if you accept student request rest of the student`&apos;`s requests will be deleted
				</span>
				<div className="mx-auto mt-4">
					<ScrollArea className="h-48 rounded-md border">
						<ul className="flex flex-col gap-4 p-2 ">
							{formTeacherClasses?.map(classItem => {
								return classItem.requestedStudents?.map(requestedStudent => (
									<li className="flex w-full items-center text-sm" key={requestedStudent?.id}>
										<div className="flex w-full flex-col items-center gap-2 sm:flex-row">
											<Avatar className="h-10 w-10 cursor-pointer border-[1px] border-violet-400">
												<AvatarImage src={requestedStudent?.user?.imageUrl} />
											</Avatar>
											<div className="flex flex-col items-center gap-1 sm:flex-row">
												<span className="font-bold">
													{requestedStudent?.user?.firstName} {requestedStudent?.user?.lastName}
												</span>
												<p>
													wants join to the{' '}
													<span className="font-bold">{classItem.className} </span>
													class.
												</p>
											</div>
											<Button
												className="mr-1 rounded-full disabled:bg-gray-300 sm:ml-auto"
												disabled={isPending}
												onClick={() =>
													handleAcceptStudent({
														studentId: requestedStudent?.user?.id,
														classId: classItem.id,
													})
												}
											>
												<FaCheck />
											</Button>
										</div>
									</li>
								));
							})}
						</ul>
					</ScrollArea>
				</div>
			</div>
		</section>
	);
};
