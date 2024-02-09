'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Button } from 'ui';
import { HoverCard, HoverCardContent, HoverCardTrigger } from 'ui/components/ui/hover-card';
import { Avatar, AvatarImage } from 'ui/components/ui/avatar';
import { onOpen } from '../../../redux/slices/modalSlice';
import { toast } from 'sonner';
import { cn } from 'ui/lib/utils';
import Link from 'next/link';
import { navigationItems } from '../../../utils/constants/navigation-items';
import { useQuery } from '@tanstack/react-query';
import { showCurrentStudent } from '../../../api/actions/user/user.queries';

export const NavbarMobile = () => {
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state: RootState) => state.user);

	const { data } = useQuery({
		queryKey: ['currentStudent'],
		queryFn: showCurrentStudent,
	});
	const currentStudent = data?.currentStudent;

	return (
		<nav className="flex justify-between p-5 lg:hidden">
			<div className="flex w-full justify-between">
				<HoverCard>
					<HoverCardTrigger>
						<div className="flex items-center">
							{currentUser?.imageUrl ? (
								<Avatar className="h-12 w-12 cursor-pointer border-[1px] border-violet-400">
									<AvatarImage src={currentUser.imageUrl} />
								</Avatar>
							) : (
								<Avatar className="h-12 w-12 cursor-pointer border-[1px] border-violet-400">
									<AvatarImage src="https://github.com/shadcn.png" />
								</Avatar>
							)}
							<div className="ml-2 flex flex-col justify-center">
								<p className="cursor-pointer font-bold">
									{currentUser?.firstName} {currentUser?.lastName}
								</p>
								<span className="-mt-1 cursor-pointer text-sm text-gray-500">
									{currentStudent?.class ? currentStudent?.class?.className : '-'}
								</span>
							</div>
						</div>
					</HoverCardTrigger>
					<HoverCardContent className="mx-3 my-2 text-center">
						<p>Click this button to update your account.</p>
						<Button
							variant="default"
							className="mt-2 w-full"
							onClick={() => {
								dispatch(onOpen('updateUser'));
							}}
						>
							Update an account
						</Button>
					</HoverCardContent>
				</HoverCard>
			</div>
			<div className="fixed bottom-0 left-0 flex w-screen justify-center bg-white dark:bg-transparent">
				<ul className="flex w-full gap-4 rounded-2xl border-[1px] p-5 dark:bg-black">
					{navigationItems.map((item, index) => (
						<li
							key={index}
							className="flex w-full cursor-pointer flex-col justify-center dark:text-white"
						>
							<Link
								onClick={() => {
									if (!currentStudent?.classId) toast.error('First you have to join to the class.');
								}}
								className={cn(
									'flex flex-col items-center justify-center text-xl transition-all hover:text-violet-600',
								)}
								href={currentStudent?.classId ? item.link : '/'}
							>
								<item.icon />
							</Link>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
};
