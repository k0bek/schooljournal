'use client';

import { Button } from 'ui';
import { Input } from 'ui/components/ui/input';
import { FiSend } from 'react-icons/fi';
import { HostMessage } from './host-message';
import { GuestMessage } from './guest-message';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createMessage,
	getAllMessages,
} from '../../../../../api/actions/messages/messages.queries';
import { useEffect, useRef, useState } from 'react';
import { RootState } from '../../../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import Lottie from 'lottie-react';
import animationData from './../../../../../public/animations/loading.json';
import { Avatar, AvatarImage } from 'ui/components/ui/avatar';
import { createNotification } from '../../../../../api/actions/notification/notification.queries';
import { assignChatNotification } from '../../../../../redux/slices/notificationSlice';

interface ChatProps {
	socket: Socket;
}

export const Chat = ({ socket, memberTwo }: ChatProps) => {
	const queryClient = useQueryClient();

	const dispatch = useDispatch();
	const [messsageValue, setMessageValue] = useState('');
	const { currentUser } = useSelector((state: RootState) => state.user);
	const { chatNotification } = useSelector((state: RootState) => state.notification);
	const { mutate } = useMutation({
		mutationFn: createMessage,
		mutationKey: ['messages'],
	});
	const { mutate: notificationMutate, data: notificationData } = useMutation({
		mutationFn: createNotification,
		mutationKey: ['notification'],
	});

	const [messages, setMessages] = useState([]);
	const lastMessageRef = useRef(null);
	const [typingStatus, setTypingStatus] = useState<{ msg: string; id: string }>({
		msg: '',
		id: '',
	});

	const {
		data: dataMessage,
		refetch: refetchMessage,
		isRefetching: isRefetchingMessage,
		isFetching: isFetchingMessage,
	} = useQuery({
		queryKey: ['messages'],
		queryFn: () => getAllMessages({ memberTwoId: memberTwo.id }),
	});

	const handleSendMessage = () => {
		mutate({ memberTwoId: memberTwo.id, message: messsageValue });
		if (messsageValue.trim()) {
			socket.emit('message', {
				text: messsageValue,
				memberTwoId: memberTwo.id,
				memberOneId: currentUser.id,
				createdAt: new Date(),
			});
			socket.emit('chatNotification', {
				text: messsageValue,
				memberTwoId: memberTwo.id,
				memberOneId: currentUser.id,
			});
		}
		setMessageValue('');
		setTypingStatus({ msg: '', id: '' });
	};

	const handleTyping = () => {
		socket.emit('typing', {
			msg: `${memberTwo.firstName} ${memberTwo.lastName} is typing`,
			id: currentUser.id,
		});
	};

	useEffect(() => {
		setMessages(dataMessage?.messages);
	}, [dataMessage]);

	useEffect(() => {
		refetchMessage();
	}, [memberTwo]);

	useEffect(() => {
		refetchMessage();
		const handleReceivedMessage = data => {
			setMessages(prev => [...prev, data]);
		};

		const handleReceivedNotificationMessage = data => {
			if (currentUser.id === data.memberTwoId) {
				dispatch(assignChatNotification(data));
				notificationMutate({
					text: 'Someone has already texted you.',
					memberTwoId: data.memberTwoId,
					memberOneId: currentUser.id,
					url: '/messages',
				});
			}
		};

		socket.on('messageResponse', handleReceivedMessage);
		socket.on('chatNotificationResponse', handleReceivedNotificationMessage);

		return () => {
			socket.off('messageResponse', handleReceivedMessage);
			socket.off('hatNotificationResponse', handleReceivedNotificationMessage);
		};
	}, [socket]);

	useEffect(() => {
		lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [dataMessage]);

	useEffect(() => {
		lastMessageRef.current.scrollTop = lastMessageRef.current.scrollHeight;
	}, [messages]);

	useEffect(() => {
		socket.on('typingResponse', data => setTypingStatus(data));
	}, [socket]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (typingStatus) {
				setTypingStatus({ msg: '', id: '' });
			}
		}, 2000);

		return () => {
			clearTimeout(timer);
		};
	}, [typingStatus]);

	return (
		<div className="mt-4 h-full max-h-[50rem] rounded-md border lg:mt-12 lg:flex lg:h-5/6 lg:w-1/2 lg:flex-col lg:justify-between">
			{isRefetchingMessage ? (
				<div role="status" className="flex h-full w-full items-center justify-center">
					<svg
						aria-hidden="true"
						className="inline h-8 w-8 animate-spin fill-purple-600 text-gray-200 dark:text-gray-600"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="currentColor"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentFill"
						/>
					</svg>
					<span className="sr-only">Loading...</span>
				</div>
			) : (
				<div className="mt-4 h-[20rem] overflow-y-auto lg:h-[40rem]" ref={lastMessageRef}>
					<div className="p-4">
						<div className="flex flex-col gap-4">
							{messages?.map(message =>
								message.memberOneId !== currentUser.id ? (
									<GuestMessage
										key={message.id}
										text={message.text}
										createdAt={message.createdAt}
									/>
								) : (
									<HostMessage key={message.id} text={message.text} createdAt={message.createdAt} />
								),
							)}
						</div>
					</div>
					{typingStatus?.id && (
						<div className="flex items-center px-5">
							<Avatar className="h-8 w-8 cursor-pointer border-[1px] border-violet-400">
								<AvatarImage src={memberTwo.imageUrl} />
							</Avatar>
							<Lottie animationData={animationData} className="w-16" />
						</div>
					)}
				</div>
			)}

			<div className="relative mt-5 flex items-center p-2">
				<Input
					type="text"
					placeholder="Type your message..."
					className="py-6"
					onChange={event => setMessageValue(event.target.value)}
					value={messsageValue}
					onKeyDown={event => {
						if (event.key === 'Enter' && messsageValue !== '') {
							handleSendMessage();
						}
						handleTyping();
					}}
				/>
				<Button
					variant="default"
					className="absolute right-4 rounded-full"
					onClick={handleSendMessage}
				>
					<FiSend />
				</Button>
			</div>
		</div>
	);
};
