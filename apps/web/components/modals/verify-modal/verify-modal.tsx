'use client';

import { Dialog, DialogContent } from 'ui/components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { onClose } from '../../../redux/slices/modalSlice';
import { useState } from 'react';
import Lottie from 'lottie-react';
import animationData from './../../../public/animations/email-sent.json';

type ErrorType = { response: { data: { msg: string } } };

export const VerifyModal = () => {
	const { isOpen, type } = useSelector((state: RootState) => state.modal);
	const isModalOpen = isOpen && type === 'verify';
	const [formError, setFormError] = useState<ErrorType>({ response: { data: { msg: '' } } });
	const dispatch = useDispatch();

	const handleClose = () => {
		setFormError({ response: { data: { msg: '' } } });
		dispatch(onClose());
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-gray-900 dark:text-white">
				<div>
					<div className="-mt-5 flex flex-col items-center justify-center px-5 text-center ">
						<div className="scale-[0.6]">
							<Lottie animationData={animationData} />
						</div>
						<div className="-mt-20 mb-20">
							<h2 className="mb-4 text-4xl font-bold">Verify your email</h2>
							<p className="px-10">
								Your registration has been successfully processed, and a verification link has been
								sent to your email for confirmation.
							</p>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
