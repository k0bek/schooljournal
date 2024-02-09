'use client';

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { assignSocket } from '../redux/slices/socketSlice';
import { socket } from '../utils/constants';

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		if (socket) {
			dispatch(assignSocket(socket));
		} else {
			dispatch(assignSocket({}));
		}
	}, []);

	return children;
};

export default SocketProvider;
