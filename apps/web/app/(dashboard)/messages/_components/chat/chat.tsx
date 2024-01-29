'use client';

import { Button } from 'ui';
import { Input } from 'ui/components/ui/input';
import { FiSend } from 'react-icons/fi';
import { HostMessage } from './host-message';
import { GuestMessage } from './guest-message';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
	createMessage,
	getAllMessages,
} from '../../../../../api/actions/messages/messages.queries';
import { useEffect, useRef, useState } from 'react';
import { RootState } from '../../../../../redux/store';
import { useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import Lottie from 'lottie-react';
import animationData from './../../../../../public/animations/loading.json';
import { Avatar, AvatarImage } from 'ui/components/ui/avatar';

interface ChatProps {
	socket: Socket;
}

export const Chat = ({ socket }: ChatProps) => {
	const [messsageValue, setMessageValue] = useState('');
	const { currentUser } = useSelector((state: RootState) => state.user);
	const { memberTwo } = useSelector((state: RootState) => state.chat);
	const { mutate } = useMutation({
		mutationFn: createMessage,
		mutationKey: ['messages'],
	});
	const [messages, setMessages] = useState([]);
	const lastMessageRef = useRef(null);
	const [typingStatus, setTypingStatus] = useState<{ msg: string; id: string }>({
		msg: '',
		id: '',
	});

	const { data: dataMessage, refetch: refetchMessage } = useQuery({
		queryKey: ['messages'],
		queryFn: getAllMessages,
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
		const handleReceivedMessage = data => {
			setMessages(prev => [...prev, data]);
		};

		socket.on('messageResponse', handleReceivedMessage);

		return () => {
			socket.off('messageResponse', handleReceivedMessage);
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
			<div className="mt-4 h-[20rem] overflow-y-auto lg:h-[40rem]" ref={lastMessageRef}>
				<div className="p-4">
					<div className="flex flex-col gap-4">
						{messages?.map(message =>
							message.memberOneId !== currentUser.id ? (
								<GuestMessage key={message.id} text={message.text} createdAt={message.createdAt} />
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
