import { useMutation, useQuery } from '@tanstack/react-query';
import { cn } from 'ui/lib/utils';
import {
	getAllNotifications,
	markReadNotification,
} from '../../../../api/actions/notification/notification.queries';
import { Avatar, AvatarImage } from 'ui/components/ui/avatar';
import { Notification } from '@prisma/client';
import { useState } from 'react';

interface NotificationListItemProps {
	notification: Notification;
}

export const NotificationListItem = ({ notification }: NotificationListItemProps) => {
	const { refetch } = useQuery({
		queryKey: ['notification'],
		queryFn: getAllNotifications,
	});
	const [isNotificationReaded, setIsNotificationReaded] = useState(false);
	const { mutate } = useMutation({
		mutationFn: markReadNotification,
		mutationKey: ['notification'],
	});

	const handleNotificationClick = notification => {
		mutate({ id: notification.id });
		setIsNotificationReaded(true);
	};

	return (
		<li
			className={cn(
				'flex cursor-pointer items-center gap-2 rounded-xl border-[1px]  p-2 text-sm transition-all hover:bg-violet-100',
				notification?.readed || isNotificationReaded ? 'border-gray-300' : 'border-violet-500',
			)}
			onClick={() => {
				handleNotificationClick(notification);
				refetch();
			}}
		>
			<Avatar className="h-12 w-12 cursor-pointer border-[1px] border-violet-400">
				<AvatarImage src="https://i.postimg.cc/63ykBGnn/purple-online-s-c44ca5f4-6c99-44f6-89ae-583879dcbeb4.png" />
			</Avatar>
			{notification?.text}
		</li>
	);
};
