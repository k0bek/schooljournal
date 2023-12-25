'use client';

import { useMutation } from '@tanstack/react-query';
import { postVerifyAccount } from '../../../../../../../api/actions/auth/auth.queries';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Lottie from 'lottie-react';
import animationData from './../../../../../../../public/animations/success.json';
import Link from 'next/link';
import { Button } from 'ui';

const VerifyPage = () => {
	const { userId, tokenId } = useParams();
	const { status, error, mutate, data } = useMutation({
		mutationFn: postVerifyAccount,
		mutationKey: ['verify'],
	});

	useEffect(() => {
		mutate({ userId, tokenId });
	}, []);

	return (
		<div className="flex h-full flex-col items-center justify-center gap-2 text-center">
			<Lottie animationData={animationData} />
			<div className="flex flex-col items-center justify-center gap-2">
				<p className="text-3xl font-bold md:text-5xl">
					Email verified <span className="text-violet-600">successfully!</span>
				</p>
				<Link href="/">
					<Button variant="default" size="lg" className="mb-14 mt-4 py-5 md:mb-28">
						Login
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default VerifyPage;
