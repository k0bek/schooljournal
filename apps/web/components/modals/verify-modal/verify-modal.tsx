'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from 'ui/components/ui/dialog';
import { Input } from 'ui/components/ui/input';
import { Button } from 'ui/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from 'ui/components/ui/form';
import { RadioGroup, RadioGroupItem } from 'ui/components/ui/radio-group';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { onClose, onOpen } from '../../../redux/slices/modalSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postRegister } from '../../../api/actions/auth/auth.queries';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signInSuccess } from '../../../redux/slices/userSlice';
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
