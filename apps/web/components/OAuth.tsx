import { useTranslations } from 'next-intl';
import { FcGoogle } from 'react-icons/fc';
import { Button } from 'ui';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from './../firebase';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { postGoogleAuth } from '../api/actions/auth/auth.queries';
import { useState } from 'react';

export const OAuth = () => {
	const t = useTranslations('Index');
	const queryClient = useQueryClient();

	const { status, error, mutate } = useMutation(postGoogleAuth, {
		onSuccess: () => {
			queryClient.invalidateQueries('google');
		},
	});

	const handleGoogleClick = async () => {
		const provider = new GoogleAuthProvider();
		const auth = getAuth(app);
		const result = await signInWithPopup(auth, provider);
		const { uid, email, photoURL: imageUrl } = result.user;
		mutate({ id: uid, email, imageUrl });
	};

	return (
		<Button
			onClick={handleGoogleClick}
			className="w-full gap-2 rounded-full py-6 text-lg"
			variant="outline"
		>
			<FcGoogle className="text-2xl" />
			{t('Sign up with Google')}
		</Button>
	);
};
