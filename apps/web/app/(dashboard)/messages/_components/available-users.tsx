'use client';

import { useQuery } from '@tanstack/react-query';
import { ScrollArea } from './../../../../../../packages/ui/components/ui/scroll-area';
import { getAllUsers } from '../../../../api/actions/user/user.queries';
import { Avatar, AvatarFallback, AvatarImage } from 'ui/components/ui/avatar';
import { IoChatboxOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { assignMemberTwo } from '../../../../redux/slices/chatSlice';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface AvailableUsersProps {
	setMemberTwoId: React.Dispatch<React.SetStateAction<string>>;
	setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
	socket: Socket;
}

export const AvailableUsers = ({ setMemberTwoId, setIsChatOpen, socket }: AvailableUsersProps) => {
	const dispatch = useDispatch();
	const { data } = useQuery({
		queryKey: ['users'],
		queryFn: getAllUsers,
	});
	const { currentUser } = useSelector((state: RootState) => state.user);

	const teachers = data?.users.filter(
		user => user.type === 'teacher' && currentUser.id !== user.id,
	);
	const students = data?.users.filter(
		user => user.type === 'student' && currentUser.id !== user.id,
	);
	const [availableUsers, setAvailableUsers] = useState([]);

	const handleOpenChat = (userId: string, user) => {
		setMemberTwoId(userId);
		setIsChatOpen(true);
		dispatch(assignMemberTwo(user));
	};

	useEffect(() => {
		socket.on('loginResponse', data => setAvailableUsers(Object.values(data)));
	}, [socket]);

	return (
		<div className="lg:w-1/4">
			<div className="flex flex-col">
				<h2 className="mb-4 text-2xl">Available teachers:</h2>
				<ScrollArea className="rounded-md border p-4 lg:max-w-[25rem]">
					<ul className="flex flex-col gap-2">
						{teachers?.map(user => {
							return (
								<button
									className="group p-2 transition-all hover:bg-gray-100"
									onClick={() => handleOpenChat(user.id, user)}
									key={user.id}
								>
									<li className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Avatar>
												<AvatarImage src={user.imageUrl} />
												<AvatarFallback>{user.username}</AvatarFallback>
											</Avatar>
											<div className="flex items-center gap-4">
												<p>
													{user.firstName} {user.lastName}
												</p>
												{availableUsers?.map(
													availableUser =>
														availableUser === user.id && (
															<div
																className="h-4 w-4 rounded-full bg-green-500"
																key={availableUser.id}
															></div>
														),
												)}
											</div>
										</div>
										<IoChatboxOutline className="w-10 cursor-pointer group-hover:text-violet-600" />
									</li>
								</button>
							);
						})}
						{teachers?.length === 0 && <div className="text-center">-</div>}
					</ul>
				</ScrollArea>
			</div>
			<div className="mt-5">
				<h2 className="mb-4 mt-4 text-2xl">Available students:</h2>
				<ScrollArea className="flex flex-col rounded-md border p-4">
					<ul className="flex flex-col gap-2">
						{students?.map(user => {
							return (
								<button
									className="group p-2 transition-all hover:bg-gray-100"
									onClick={() => handleOpenChat(user.id, user)}
									key={user.id}
								>
									<li className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Avatar>
												<AvatarImage src={user.imageUrl} />
												<AvatarFallback>{user.username}</AvatarFallback>
											</Avatar>
											<div className="flex items-center gap-4">
												<p>
													{user.firstName} {user.lastName}
												</p>
												{availableUsers?.map(
													availableUser =>
														availableUser === user.id && (
															<div
																className="h-4 w-4 rounded-full bg-green-500"
																key={availableUser.id}
															></div>
														),
												)}
											</div>
										</div>
										<IoChatboxOutline className="w-10 cursor-pointer group-hover:text-violet-600" />
									</li>
								</button>
							);
						})}
					</ul>
					{students?.length === 0 && <div className="text-center">-</div>}
				</ScrollArea>
			</div>
		</div>
	);
};
