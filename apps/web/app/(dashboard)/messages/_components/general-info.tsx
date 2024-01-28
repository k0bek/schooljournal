import { AvatarImage, Avatar } from 'ui/components/ui/avatar';
import { User } from '@prisma/client';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

export const GeneralInfo = () => {
	const { memberTwo } = useSelector((state: RootState) => state.chat);

	return (
		<div className="mt-5 flex flex-col pb-2 lg:mt-11">
			<h2 className="mb-4 text-2xl">General info</h2>
			<div className="flex flex-col rounded-md border p-4">
				<div className="z-[-1] flex items-center">
					<Avatar className="h-8 w-8 cursor-pointer border-[1px] border-violet-400">
						<AvatarImage src={memberTwo?.imageUrl} />
					</Avatar>
					<div>
						<span className="ml-1 mr-2 text-sm font-semibold">
							{memberTwo?.firstName} {memberTwo?.lastName}
						</span>
					</div>
				</div>
				<div className="flex flex-col items-start text-[0.9rem]">
					<p className="mt-2 text-gray-600">Email</p>
					<span>{memberTwo?.email}</span>
				</div>
				<div className="flex flex-col items-start text-[0.9rem]">
					<p className="mt-2 text-gray-600">Date created</p>
					<span>
						{moment(memberTwo?.createdAt)
							.add(24, 'hours')
							.format('LLL')}
					</span>
				</div>
			</div>
		</div>
	);
};
