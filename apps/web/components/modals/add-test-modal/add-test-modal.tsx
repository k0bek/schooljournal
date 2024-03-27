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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { formSchema } from './add-test-schema';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from 'ui/components/ui/select';
import { getClasses } from '../../../api/actions/class/class.queries';
import { addTest } from '../../../api/actions/tests/tests.queries';

type ErrorType = { response: { data: { msg: string } } };

export const AddTestModal = () => {
	const router = useRouter();
	const { isOpen, type } = useSelector((state: RootState) => state.modal);
	const dispatch = useDispatch();
	const isModalOpen = isOpen && type === 'addTest';
	const [formError, setFormError] = useState<ErrorType>({ response: { data: { msg: '' } } });
	const { testDate } = useSelector((state: RootState) => state.addTest);
	const { classId } = useSelector((state: RootState) => state.classId);
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			class: '',
			topic: '',
			subject: '',
		},
	});

	const { data } = useQuery({
		queryKey: ['classes'],
		queryFn: getClasses,
	});
	const classes = data?.classes;
	const choosedClass = classes?.find(currentClass => currentClass.id === classId);

	const { status, mutate: addTestMutate } = useMutation({
		mutationFn: addTest,
		mutationKey: ['addTest'],
		onSuccess: ({ data }) => {
			form.reset();
			dispatch(onClose());
			setFormError({ response: { data: { msg: '' } } });
			queryClient.invalidateQueries({ queryKey: ['tests'] });
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

	const onSubmit = ({ topic, subject }: { topic: string; subject: string }) => {
		try {
			addTestMutate({
				topic,
				classId: choosedClass?.id,
				subjectName: subject,
				testDate,
				className: choosedClass?.className,
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-gray-900 dark:text-white">
				<DialogHeader className="px-6 pt-8 dark:bg-gray-900">
					<DialogTitle className="text-center text-2xl font-bold dark:bg-gray-900 dark:text-white">
						Add test
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-8 dark:bg-gray-900" onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-8 px-6">
							<FormField
								control={form.control}
								name="topic"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70 dark:text-white">
											Test topic
										</FormLabel>
										<FormControl>
											<Input
												className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-white"
												placeholder="Enter test topic"
												{...field}
												disabled={status === 'pending'}
											/>
										</FormControl>
										<FormMessage className="dark:text-red-400" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="subject"
								render={({ field }) => (
									<FormItem {...field}>
										<FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70 dark:text-white">
											Subject
										</FormLabel>
										<FormControl>
											<Select>
												<SelectTrigger>
													<SelectValue placeholder="Subject" />
												</SelectTrigger>
												<SelectContent>
													{choosedClass?.subjects?.map(subject => {
														return (
															<SelectItem key={subject.id} value={subject.subjectName}>
																{subject.subjectName}
															</SelectItem>
														);
													})}
												</SelectContent>
											</Select>
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
								Add test
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
