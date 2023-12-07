import { useTranslations } from 'next-intl';
import { FcGoogle } from 'react-icons/fc';
import { Button } from 'ui';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from './../firebase';
import { useMutation } from 'react-query';
import axios from 'axios';

export const OAuth = () => {
	const handleGoogleClick = async () => {
		const provider = new GoogleAuthProvider();
		const auth = getAuth(app);

		const result = await signInWithPopup(auth, provider);
	};

	const { data, isLoading } = useMutation({
		mutationFn: async () => {
			const { data } = await axios.post('/api/v1/google', {});
			return data;
		},
	});
	const t = useTranslations('Index');

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
