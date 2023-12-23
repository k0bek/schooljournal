import { FcGoogle } from 'react-icons/fc';
import { Button } from 'ui';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from './../firebase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postGoogleAuth } from '../api/actions/auth/auth.queries';
import { useRouter } from 'next/navigation';

export const OAuth = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	// const { status, error, mutate } = useMutation(postGoogleAuth, {
	// 	onSuccess: () => {
	// 		router.push('/home');
	// 	},
	// });

	const handleGoogleClick = async () => {
		const provider = new GoogleAuthProvider();
		const auth = getAuth(app);
		const result = await signInWithPopup(auth, provider);
		const { uid, email, photoURL: imageUrl, displayName } = result.user;
		// mutate({ id: uid, email, imageUrl, username: displayName });
	};

	return (
		<Button
			onClick={handleGoogleClick}
			className="w-full gap-2 rounded-full py-6 text-lg"
			variant="outline"
		>
			<FcGoogle className="text-2xl" />
			{'Sign up with Google'}
		</Button>
	);
};
