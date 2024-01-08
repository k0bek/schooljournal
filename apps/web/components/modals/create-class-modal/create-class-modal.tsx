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
import { Badge } from 'ui/components/ui/badge';
import { Command, CommandGroup, CommandItem } from 'ui/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { onClose } from '../../../redux/slices/modalSlice';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import React from 'react';
import { formSchema } from './create-class-modal-schema';
import { createClass } from '../../../api/actions/class/class.queries';

type ErrorType = { response: { data: { msg: string } } };

const subjects = [
	{ value: 'maths', label: 'Maths' },
	{ value: 'english', label: 'English' },
	{ value: 'geography', label: 'Geography' },
	{ value: 'pe', label: 'PE' },
	{ value: 'german', label: 'German' },
	{ value: 'computer-science', label: 'Computer science' },
	{ value: 'history', label: 'History' },
	{ value: 'music', label: 'Music' },
];

export const CreateClassModal = () => {
	const router = useRouter();
	const { isOpen, type } = useSelector((state: RootState) => state.modal);
	const dispatch = useDispatch();
	const isModalOpen = isOpen && type === 'createClass';
	const [formError, setFormError] = useState<ErrorType>({ response: { data: { msg: '' } } });
	const inputRef = useRef(null);
	const [isCommandOpen, setIsCommandOpen] = useState(false);
	const [subjectInputValue, setSubjectInputValue] = useState('');
	const [selected, setSelected] = useState([subjects[0]]);

	const handleUnselect = useCallback(subject => {
		setSelected(prev => prev.filter(s => s.value !== subject.value));
	}, []);

	const selectables = subjects.filter(subject => !selected.includes(subject));

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			className: '',
			numberOfStudents: 10,
			subjects: 'maths',
		},
	});

	const { status, error, mutate } = useMutation({
		mutationFn: createClass,
		mutationKey: ['createClass'],
		onSuccess: ({ data }) => {
			form.reset();
			dispatch(onClose());
			setFormError({ response: { data: { msg: '' } } });
			router.refresh();
		},
		onError: (data: ErrorType) => {
			setFormError(data);
		},
	});

	console.log(error);

	const onSubmit = ({
		className,
		numberOfStudents,
	}: {
		className?: string;
		numberOfStudents?: number;
	}) => {
		try {
			let valueSubjects = selected.map(subject => subject.value);
			if (selected.length === 0) {
				form.setError('subjects', {
					type: 'custom',
					message: 'You have to add subjects to create a class.',
				});
			}
			setSelected([subjects[0]]);

			mutate({ className, numberOfStudents, subjects: valueSubjects });
			router.refresh();
		} catch (error) {
			console.log(error);
		}
	};

	const handleClose = () => {
		setFormError({ response: { data: { msg: '' } } });
		form.reset();
		router.refresh();
		dispatch(onClose());
		setSelected([subjects[0]]);
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white p-0 text-black dark:bg-gray-900 dark:text-white">
				<DialogHeader className="px-6 pt-8 dark:bg-gray-900">
					<DialogTitle className="text-center text-2xl font-bold dark:bg-gray-900 dark:text-white">
						Create your own class
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-8 dark:bg-gray-900" onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-8 px-6">
							<FormField
								control={form.control}
								name="className"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70 dark:text-white">
											Class name
										</FormLabel>
										<FormControl>
											<Input
												className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-white"
												placeholder="Enter your class name"
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
								name="numberOfStudents"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70 dark:text-white">
											Number of students
										</FormLabel>
										<FormControl>
											<Input
												className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-white"
												placeholder="Enter number of students"
												{...field}
												type="number"
												{...form.register('numberOfStudents', {
													valueAsNumber: true,
												})}
											/>
										</FormControl>
										<FormMessage className="dark:text-red-400" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="subjects"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70 dark:text-white">
											Select subjects that you want
										</FormLabel>

										<Command className="overflow-visible">
											<div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
												<div className="flex flex-wrap gap-1">
													{selected.map(subject => {
														return (
															<Badge key={subject.value} variant="secondary">
																{subject.label}
																<button
																	className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
																	onClick={() => handleUnselect(subject)}
																>
																	X
																</button>
															</Badge>
														);
													})}
													<CommandPrimitive.Input
														ref={inputRef}
														value={subjectInputValue}
														onValueChange={setSubjectInputValue}
														onBlur={() => setIsCommandOpen(false)}
														onFocus={() => setIsCommandOpen(true)}
														placeholder="Select subjects..."
														className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
													/>
												</div>
											</div>
											<div className="relative">
												{isCommandOpen && selectables.length > 0 ? (
													<div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
														<CommandGroup className="h-full overflow-auto">
															{selectables.map(subject => {
																return (
																	<CommandItem
																		key={subject.value}
																		onMouseDown={e => {
																			e.preventDefault();
																			e.stopPropagation();
																		}}
																		onSelect={value => {
																			setSubjectInputValue('');
																			setSelected(prev => [...prev, subject]);
																		}}
																		className={'cursor-pointer'}
																	>
																		{subject.label}
																	</CommandItem>
																);
															})}
														</CommandGroup>
													</div>
												) : null}
											</div>
										</Command>
										{form.formState.errors.subjects?.message && (
											<div className="text-[0.8rem] font-medium text-red-500 dark:text-red-400">
												{form.formState.errors.subjects?.message}
											</div>
										)}
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
