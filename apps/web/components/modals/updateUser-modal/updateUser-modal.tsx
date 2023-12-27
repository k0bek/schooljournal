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
import { FormDescription } from 'ui/components/ui/form';
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
import { ChangeEvent, useState } from 'react';
import { formSchema } from './updateUser-schema';
import React from 'react';
import { signInSuccess } from '../../../redux/slices/userSlice';
import { updateUser } from '../../../api/actions/user/user.queries';

type ErrorType = { response: { data: { msg: string } } };

export const UpdateUserModal = () => {
	const router = useRouter();
	const { isOpen, type } = useSelector((state: RootState) => state.modal);
	const { currentUser } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();
	const isModalOpen = isOpen && type === 'updateUser';
	const [formError, setFormError] = useState<ErrorType>({ response: { data: { msg: '' } } });
	const [preview, setPreview] = useState<string | undefined>('');

	async function getImageData(event: ChangeEvent<HTMLInputElement>) {
		const dataTransfer = new DataTransfer();

		Array.from(event.target.files!).forEach(image => dataTransfer.items.add(image));
		const file = dataTransfer.files[0];

		if (typeof file === 'undefined') return;

		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', 'school-journal');
		formData.append('api_key', process.env.API_KEY);

		const results = await fetch('https://api.cloudinary.com/v1_1/dedatowvi/image/upload', {
			method: 'POST',
			body: formData,
		}).then(r => r.json());

		setPreview(results.secure_url);
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			circle_image: '',
		},
	});

	const { status, error, mutate } = useMutation({
		mutationFn: updateUser,
		mutationKey: ['updateUser'],
		onSuccess: ({ data }) => {
			form.reset();
			dispatch(signInSuccess(data.updatedUser));
			dispatch(onClose());
			setFormError({ response: { data: { msg: '' } } });
			setPreview('');
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
		setPreview('');
	};

	const onSubmit = ({ firstName, lastName }: { firstName: string; lastName: string }) => {
		try {
			const dataToUpdate: any = {};
			if (firstName) dataToUpdate.firstName = firstName;
			if (lastName) dataToUpdate.lastName = lastName;
			if (currentUser?.email) dataToUpdate.email = currentUser.email;
			if (preview) dataToUpdate.imageUrl = preview;

			if (Object.keys(dataToUpdate).length > 0) {
				mutate(dataToUpdate);
				router.refresh();
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-gray-900 dark:text-white">
				<DialogHeader className="px-6 pt-8 dark:bg-gray-900">
					<DialogTitle className="text-center text-2xl font-bold dark:bg-gray-900 dark:text-white">
						Update your account
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
												placeholder={currentUser.firstName}
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
												placeholder={currentUser.lastName}
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
								name="circle_image"
								render={({ field: { onChange, value, ...rest } }) => (
									<>
										<FormItem>
											<FormLabel>Circle Image</FormLabel>
											{preview && (
												<img
													className="h-20 w-20 rounded-full border-[1px] border-violet-600"
													src={preview}
												/>
											)}
											<FormControl>
												<Input
													type="file"
													accept="image/png, image/jpg"
													{...rest}
													onChange={event => {
														getImageData(event);
													}}
												/>
											</FormControl>
											<FormDescription>
												Choose best image that bring spirits to your circle.
											</FormDescription>
											<FormMessage />
										</FormItem>
									</>
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
