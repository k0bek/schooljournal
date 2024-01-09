'use client';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Button } from 'ui';
import { HoverCard, HoverCardContent, HoverCardTrigger } from 'ui/components/ui/hover-card';

import { Avatar, AvatarImage } from 'ui/components/ui/avatar';
import { onOpen } from '../../../redux/slices/modalSlice';

import { PiNumberSquareFiveBold } from 'react-icons/pi';
import { FaRegCalendar } from 'react-icons/fa';
import { LuTrophy } from 'react-icons/lu';
import { FaRegMessage } from 'react-icons/fa6';
import { PiExam } from 'react-icons/pi';
import Link from 'next/link';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../../../../../packages/ui/components/ui/tooltip';
import { cn } from 'ui/lib/utils';
import { toast } from 'sonner';

const navigationItems = [
	{ name: 'Grades', link: '/grades', icon: <PiNumberSquareFiveBold /> },
	{ name: 'Frequency', link: '/frequency', icon: <FaRegCalendar /> },
	{ name: 'Achievements', link: '/achievements', icon: <LuTrophy /> },
	{ name: 'Messages', link: '/messages', icon: <FaRegMessage /> },
	{ name: 'Tests', link: '/tests', icon: <PiExam /> },
];

export const NavbarMobile = () => {
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state: RootState) => state.user);

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
									{/* {currentUser?.classe ? currentUser?.class : '-'} */}
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
			<div className="fixed bottom-0 left-0 flex w-screen justify-center bg-white">
				<ul className="flex w-full gap-4 rounded-2xl border-[1px] p-5">
					{navigationItems.map((item, index) => (
						<li key={index} className="flex w-full flex-col justify-center ">
							{/* <Link onClick={()=>{if(!currentUser?.class) toast.error('First you have to join to the class.')}} aria-disabled={!currentUser?.class} className={cn('flex flex-col justify-center items-center text-xl hover:text-violet-600 transition-all')} href={currentUser?.class ?item.link : '/'}>{item.icon} <span className="text-xs hidden sm:block">{item.name}</span></Link> */}
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
};
