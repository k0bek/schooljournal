'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Dialog,
	DialogContent,
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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { onClose } from '../../../redux/slices/modalSlice';
import { signInSuccess } from '../../../redux/slices/userSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postLogin, postRegister } from '../../../api/actions/auth/auth.queries';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formSchema } from './login-modal-form-schema';

type ErrorType = { response: { data: { msg: string } } };

export const LoginModal = () => {
	const router = useRouter();
	const { isOpen, type } = useSelector((state: RootState) => state.modal);
	const { currentUser } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();
	const isModalOpen = isOpen && type === 'login';
	const [formError, setFormError] = useState<ErrorType>({ response: { data: { msg: '' } } });

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const isLoading = form.formState.isSubmitting;

	const { status, error, mutate } = useMutation({
		mutationFn: postLogin,
		mutationKey: ['login'],
		onSuccess: ({ data }) => {
			form.reset();
			dispatch(onClose());
			dispatch(signInSuccess(data.user));
			router.push('/home');
			setFormError({ response: { data: { msg: '' } } });
		},
		onError: (data: ErrorType) => {
			setFormError(data);
		},
	});

	const handleClose = () => {
		setFormError({ response: { data: { msg: '' } } });
		form.reset();
		router.refresh();
		dispatch(onClose());
	};

	const onSubmit = ({ email, password }: { email: string; password: string }) => {
		try {
			mutate({ email, password });
			router.refresh();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-gray-900 dark:text-white">
				<DialogHeader className="px-6 pt-8 dark:bg-gray-900">
					<DialogTitle className="text-center text-2xl font-bold dark:bg-gray-900 dark:text-white">
						Log in
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-8 dark:bg-gray-900" onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-8 px-6">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70 dark:text-white">
											Email
										</FormLabel>
										<FormControl>
											<Input
												className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-white"
												placeholder="Enter email address"
												{...field}
												type="email"
												disabled={status === 'pending'}
											/>
										</FormControl>
										<FormMessage className="dark:text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70 dark:text-white">
											Password
										</FormLabel>
										<FormControl>
											<Input
												className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-white"
												placeholder="Enter password"
												{...field}
												type="password"
												disabled={status === 'pending'}
											/>
										</FormControl>
										<FormMessage className="dark:text-red-400" />
									</FormItem>
								)}
							/>
							{formError.response.data.msg && (
								<div className="text-md rounded-lg bg-red-400 py-2 text-center text-white">
									{formError?.response?.data?.msg}
								</div>
							)}
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-slate-800">
							<Button variant="default" disabled={status === 'pending'}>
								Log in
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
