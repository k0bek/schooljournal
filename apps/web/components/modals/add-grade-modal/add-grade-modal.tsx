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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formSchema } from './add-grade-schema';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from 'ui/components/ui/select';
import { addGrade } from '../../../api/actions/grades/grades.queries';

type ErrorType = { response: { data: { msg: string } } };

export const AddGradeModal = () => {
	const router = useRouter();
	const { isOpen, type } = useSelector((state: RootState) => state.modal);
	const { studentId, subjectsWithNameAndId } = useSelector((state: RootState) => state.addGrade);
	const dispatch = useDispatch();
	const isModalOpen = isOpen && type === 'addGrade';
	const [formError, setFormError] = useState<ErrorType>({ response: { data: { msg: '' } } });
	const [subjectId, setSubjectId] = useState('');
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			grade: 5,
			topic: '',
		},
	});

	const { status, mutate: addGradeMutate } = useMutation({
		mutationFn: addGrade,
		mutationKey: ['addGrade'],
		onSuccess: ({ data }) => {
			form.reset();
			dispatch(onClose());
			setFormError({ response: { data: { msg: '' } } });
			queryClient.invalidateQueries({ queryKey: ['subjects'] });
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

	const onSubmit = ({ grade, topic }: { grade: number; topic: string }) => {
		try {
			addGradeMutate({ grade, topic, studentId, subjectId });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="overflow-hidden bg-white p-0 text-black dark:bg-gray-900 dark:text-white">
				<DialogHeader className="px-6 pt-8 dark:bg-gray-900">
					<DialogTitle className="text-center text-2xl font-bold dark:bg-gray-900 dark:text-white">
						Add grade
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-8 dark:bg-gray-900" onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-8 px-6">
							<FormField
								control={form.control}
								name="grade"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70 dark:text-white">
											Grade
										</FormLabel>
										<FormControl>
											<Input
												className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-white"
												placeholder="Enter grade"
												{...field}
												type="number"
												disabled={status === 'pending'}
												max={6}
												min={1}
												onChange={event => field.onChange(+event.target.value)}
											/>
										</FormControl>
										<FormMessage className="dark:text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="topic"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70 dark:text-white">
											Topic
										</FormLabel>
										<FormControl>
											<Input
												className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-white"
												placeholder="Enter topic"
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
								name="subject"
								render={({ field }) => (
									<FormItem {...field}>
										<FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70 dark:text-white">
											Subject
										</FormLabel>
										<FormControl>
											<Select
												onValueChange={value => {
													setSubjectId(value);
												}}
											>
												<SelectTrigger>
													<SelectValue placeholder="Subject" />
												</SelectTrigger>
												<SelectContent>
													{subjectsWithNameAndId.map(subject => {
														return (
															<SelectItem key={subject.id} value={subject.id}>
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
								Add grade
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
