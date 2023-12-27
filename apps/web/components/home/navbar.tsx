'use client';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import defaultUserIcon from './../../../web/public/_static/svg/empy-user-image.svg';
import notificationIcon from './../../../web/public/_static/svg/notification.svg';
import { Button } from 'ui';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '../../../../packages/ui/components/ui/hover-card';

import { Avatar, AvatarImage } from '../../../../packages/ui/components/ui/avatar';
import { onOpen } from '../../redux/slices/modalSlice';

export const Navbar = () => {
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state: RootState) => state.user);

	return (
		<div className="flex justify-between">
			<div>
				<HoverCard>
					<HoverCardTrigger>
						<div className="flex items-center">
							{currentUser.imageUrl ? (
								<Avatar className="cursor-pointer border-[1px] border-violet-600">
									<AvatarImage src={currentUser.imageUrl} />
								</Avatar>
							) : (
								<Avatar className="cursor-pointer border-[1px] border-violet-600">
									<AvatarImage src="https://github.com/shadcn.png" />
								</Avatar>
							)}
							<div className="ml-2 flex flex-col justify-center">
								<p className="cursor-pointer font-bold">
									{currentUser?.firstName} {currentUser?.lastName}
								</p>
								<span className="-mt-1 cursor-pointer text-sm text-gray-500">
									{currentUser?.username}
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
			<Button variant="outline" className="h-10 w-[3.2rem] rounded-3xl">
				<Image src={notificationIcon} alt="notification icon" />
			</Button>
		</div>
	);
};
