'use client';

import { Avatar, AvatarImage } from 'ui/components/ui/avatar';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import moment from 'moment';

interface GuestMessageProps {
	text: string;
	createdAt: string;
}

export const GuestMessage = ({ text, createdAt }: GuestMessageProps) => {
	const { memberTwo } = useSelector((state: RootState) => state.chat);

	return (
		<div>
			<div className="mb-3 flex items-center">
				<Avatar className="h-8 w-8 cursor-pointer border-[1px] border-violet-400">
					<AvatarImage src={memberTwo?.imageUrl} />
				</Avatar>
				<span className="ml-1 mr-2 text-sm font-semibold">
					{memberTwo?.firstName} {memberTwo?.lastName}
				</span>
				<span className="block text-right text-sm">
					{moment(createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').fromNow()}
				</span>
			</div>
			<p className="mr-auto w-4/6 break-words rounded-xl bg-white p-2 text-sm dark:text-black">
				{text}
			</p>
		</div>
	);
};
