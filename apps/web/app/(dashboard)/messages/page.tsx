'use client';

import React, { useEffect, useState, useRef } from 'react';
import { AvailableUsers } from './_components/available-users';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { onClose, onOpen } from '../../../redux/slices/modalSlice';
import { Chat } from './_components/chat/chat';
import { GeneralInfo } from './_components/general-info';
import { io } from 'socket.io-client';
const socket = io('http://localhost:5001/');

const MessagePage = () => {
	const [isChatOpen, setIsChatOpen] = useState(false);
	const { currentUser } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!currentUser?.firstName || !currentUser?.lastName) {
			dispatch(onOpen('firstNameLastName'));
		} else {
			dispatch(onClose());
		}
		socket.emit('login', { userId: currentUser.id });
	}, []);

	return (
		<main className="w-full px-5 pb-20 lg:ml-64 lg:flex lg:gap-12 lg:py-5">
			<AvailableUsers setIsChatOpen={setIsChatOpen} socket={socket} />
			{isChatOpen && (
				<>
					<Chat socket={socket} />
					<GeneralInfo />
				</>
			)}
		</main>
	);
};

export default MessagePage;
