'use client';

import { useQuery } from '@tanstack/react-query';
import { showCurrentUser } from '../api/actions/user/user.queries';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/slices/userSlice';
import { useEffect } from 'react';

const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useDispatch();
	const { data, error, isFetched } = useQuery({
		queryKey: ['user'],
		queryFn: showCurrentUser,
	});

	useEffect(() => {
		if (data) {
			dispatch(signInSuccess(data?.user));
		} else {
			dispatch(signInSuccess({}));
		}
	}, [data]);
	return children;
};

export default UserProvider;
