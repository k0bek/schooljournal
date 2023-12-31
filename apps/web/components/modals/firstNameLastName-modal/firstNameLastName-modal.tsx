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
import { RadioGroup, RadioGroupItem } from 'ui/components/ui/radio-group';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formSchema } from './firstNameLastName-schema';
import React from 'react';
import { signInSuccess } from '../../../redux/slices/userSlice';
import { updateUser } from '../../../api/actions/user/user.queries';

type ErrorType = { response: { data: { msg: string } } };

export const FirstNameLastNameModal = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { isOpen, type } = useSelector((state: RootState) => state.modal);
	const { currentUser } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();
	const isModalOpen = isOpen && type === 'firstNameLastName';
	const [formError, setFormError] = useState<ErrorType>({ response: { data: { msg: '' } } });

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			type: 'student',
		},
	});

	const isLoading = form.formState.isSubmitting;

	const { status, error, mutate } = useMutation({
		mutationFn: updateUser,
		mutationKey: ['firstNamelastName'],
		onSuccess: ({ data }) => {
			form.reset();
			dispatch(signInSuccess(data.updatedUser));
			dispatch(onClose());
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

	const onSubmit = ({
		firstName,
		lastName,
		type,
	}: {
		firstName: string;
		lastName: string;
		type: 'student' | 'teacher';
	}) => {
		try {
			mutate({ firstName, lastName, email: currentUser?.email, type });
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
						Enter your full name
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-8 dark:bg-gray-900" onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-8 px-6">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70 dark:text-white">
											First name
										</FormLabel>
										<FormControl>
											<Input
												className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-white"
												placeholder="Enter your first name"
												{...field}
												type="text"
												disabled={status === 'pending'}
											/>
										</FormControl>
										<FormMessage className="dark:text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70 dark:text-white">
											Last name
										</FormLabel>
										<FormControl>
											<Input
												className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-white"
												placeholder="Enter your last name"
												{...field}
												type="text"
											/>
										</FormControl>
										<FormMessage className="dark:text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem className="space-y-3">
										<FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70 dark:text-white">
											Who are you?
										</FormLabel>

										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={field.value}
												className="flex flex-col space-y-1"
												disabled={status === 'pending'}
											>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="student" />
													</FormControl>
													<FormLabel className="font-normal">Student</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="teacher" />
													</FormControl>
													<FormLabel className="font-normal">Teacher</FormLabel>
												</FormItem>
											</RadioGroup>
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
								Save changes
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
