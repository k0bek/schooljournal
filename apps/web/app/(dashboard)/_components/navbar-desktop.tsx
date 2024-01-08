'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Avatar, AvatarImage } from 'ui/components/ui/avatar';
import LogoutButton from './logout-button';
import { onOpen } from '../../../redux/slices/modalSlice';
import Link from 'next/link';
import { Button } from 'ui';
import { PiNumberSquareFiveBold } from 'react-icons/pi';
import { FaRegCalendar } from 'react-icons/fa';
import { LuTrophy } from 'react-icons/lu';
import { FaRegMessage } from 'react-icons/fa6';
import { PiExam } from 'react-icons/pi';
import { IoIosJournal } from 'react-icons/io';
import { ImProfile } from 'react-icons/im';
import SquigglyLines from './../../../public/_static/svg/squigily-lines';
import { toast } from 'sonner';

const navigationItems = [
	{ name: 'Grades', link: '/grades', icon: <PiNumberSquareFiveBold /> },
	{ name: 'Frequency', link: '/frequency', icon: <FaRegCalendar /> },
	{ name: 'Achievements', link: '/achievements', icon: <LuTrophy /> },
	{ name: 'Messages', link: '/messages', icon: <FaRegMessage /> },
	{ name: 'Tests', link: '/tests', icon: <PiExam /> },
];

export const NavbarDesktop = () => {
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state: RootState) => state.user);

	return (
		<nav className="fixed hidden h-screen w-full flex-col items-center border-r-[1px] border-gray-300 p-5 lg:flex lg:w-60 dark:bg-transparent">
			<div className="flex flex-col items-center">
				<div className="flex flex-col items-center" onClick={() => dispatch(onOpen('updateUser'))}>
					{currentUser?.imageUrl ? (
						<Avatar className="h-20 w-20 cursor-pointer border-[1px] border-violet-400">
							<AvatarImage src={currentUser.imageUrl} />
						</Avatar>
					) : (
						<Avatar className="h-20 w-20 cursor-pointer border-[1px] border-violet-400">
							<AvatarImage src="https://github.com/shadcn.png" />
						</Avatar>
					)}
					<div className="ml-2 mt-1 flex flex-col justify-center text-center">
						<p className="cursor-pointer text-lg font-bold">
							{currentUser?.firstName} {currentUser?.lastName}
						</p>
						<span className="text-md -mt-1 cursor-pointer text-gray-500">
							{/* {currentUser?.class ? currentUser?.class : '-'} */}
						</span>
					</div>
				</div>
				<LogoutButton />
			</div>
			<div className="w-full">
				<h2 className="mr-auto mt-4 text-2xl font-semibold">Studying</h2>
				<SquigglyLines />
				<ul className="mr-auto flex w-full flex-col gap-4">
					{navigationItems.map((item, index) => (
						<li
							key={index}
							className="w-full rounded-2xl px-3 py-2 transition-all hover:bg-violet-100 hover:text-violet-600"
						>
							{/* <Link onClick={()=>{if(!currentUser?.class &&currentUser?.type==='student') toast.error('First you have to join to the class.')}} className="w-full text-md font-semibold flex items-center gap-2" href={currentUser?.class &&currentUser.type==='student' || currentUser.type==='teacher' ?item.link : '/'}>{item.icon} {item.name}</Link> */}
						</li>
					))}
				</ul>
				<h2 className="mr-auto mt-10 text-2xl font-semibold">Information</h2>
				<SquigglyLines />
			</div>
			<div className="mr-auto flex w-full flex-col gap-4">
				<Button
					variant="ghost"
					className="text-md flex w-full items-center justify-start gap-2 rounded-2xl px-3 py-5 font-semibold transition-all hover:bg-violet-100 hover:text-violet-600"
				>
					<IoIosJournal /> About the journal
				</Button>
				<Button
					onClick={() => dispatch(onOpen('updateUser'))}
					variant="ghost"
					className="text-md flex w-full items-center justify-start gap-2 rounded-2xl px-3 py-5 font-semibold transition-all hover:bg-violet-100 hover:text-violet-600"
				>
					<ImProfile /> Update profile
				</Button>
			</div>
		</nav>
	);
};
