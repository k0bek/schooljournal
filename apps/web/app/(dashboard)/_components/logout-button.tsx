'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from 'ui';
import { logout } from '../../../api/actions/auth/auth.queries';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { redirect, useRouter } from 'next/navigation';
import { signInSuccess } from '../../../redux/slices/userSlice';

const LogoutButton = () => {
	const { currentUser } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();
	const router = useRouter();
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: logout,
		mutationKey: ['logout'],
		onSuccess: ({ data }) => {
			router.push('/');
			dispatch(signInSuccess(data.user));
			queryClient.clear();
		},
	});

	return (
		<Button
			variant="secondary"
			className="absolute bottom-5 w-3/4"
			onClick={() => {
				mutate({ userId: currentUser.id });
			}}
		>
			Logout
		</Button>
	);
};

export default LogoutButton;
