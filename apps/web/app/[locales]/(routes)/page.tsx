'use client';

import { useTranslations } from 'next-intl';
import Lottie from 'lottie-react';
import animationData from '../../../public/animations/school-animation.json';
import { Button } from 'ui';
import { ModeToggle } from '../../../components/mode-toggle';
import { OAuth } from '../../../components/OAuth';
import { RegisterModal } from '../../../components/modals/register-modal/register-modal';
import { onOpen } from '../../../redux/slices/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

export default function HomePage() {
	const t = useTranslations('Index');
	const { isOpen, type } = useSelector((state: RootState) => state.modal);
	const dispatch = useDispatch();

	return (
		<main className="mx-auto flex min-h-screen max-w-lg items-center justify-center">
			<div className="flex h-full flex-col justify-center p-4 xl:flex-row xl:items-center xl:gap-10">
				<div className="mx-auto mb-5 w-full lg:w-[40rem] xl:w-[68rem]">
					<Lottie animationData={animationData} />
				</div>
				<div className="text-left font-bold">
					<h1 className="text-5xl drop-shadow-md">
						{t('The best school journal for your needs!')}
					</h1>
					<p className="mb-7 mt-2 text-2xl text-violet-600 dark:text-violet-500">
						{t('Join today')}
					</p>
					<div className="flex flex-col gap-2">
						<OAuth />
						<div className="flex items-center justify-center gap-2">
							<hr className="h-[2px] w-full bg-violet-600" />
							<span>{t('or')}</span>
							<hr className="h-[2px] w-full bg-violet-600" />
						</div>
						<Button
							className="w-full rounded-full py-6 text-lg"
							onClick={() => dispatch(onOpen('register'))}
						>
							{t('Create an account')}
						</Button>
					</div>
					<div className="mt-7">
						<p className="mb-2 font-medium">{t('Do you already have an account?')}</p>
						<Button
							onClick={() => dispatch(onOpen('login'))}
							className="w-full rounded-full py-6 text-lg"
							variant="secondary"
						>
							{t('Log in')}
						</Button>
						<div className="absolute bottom-5 left-5">
							<ModeToggle />
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
