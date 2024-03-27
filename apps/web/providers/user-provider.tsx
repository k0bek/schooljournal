'use client';

import { useQuery } from '@tanstack/react-query';
import { showCurrentStudent, showCurrentUser } from '../api/actions/user/user.queries';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/slices/userSlice';
import { useEffect } from 'react';

const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useDispatch();
	const { data: userData } = useQuery({
		queryKey: ['user'],
		queryFn: showCurrentUser,
	});
	const user = userData?.user;

	useEffect(() => {
		if (userData) {
			dispatch(signInSuccess(user));
		} else {
			dispatch(signInSuccess({}));
		}
	}, [user]);

	return <>{children}</>;
};

export default UserProvider;
