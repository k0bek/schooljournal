'use client';

import { Button } from 'ui';
import { useState } from 'react';
import { cn } from 'ui/lib/utils';
import { NotificationListItem } from './notification-list-item';

export const NotificationList = ({ notifications }) => {
	const [isAll, setIsAll] = useState(true);
	const unreadedNotifications = notifications?.filter(notification => !notification?.readed);

	const handleChangeNotifationsToRead = () => {
		setIsAll(prev => !prev);
	};

	return (
		<div className="0 fixed right-4 top-20 z-50 h-full w-72 rounded-md bg-white p-2 shadow-md">
			<p className="p-2 text-2xl font-bold">Notifications</p>
			<div className="flex gap-3 pl-2">
				<Button
					variant="outline"
					className={cn(
						'font-bold',
						isAll && 'border-violet-500 text-violet-500 hover:text-violet-500',
					)}
					onClick={handleChangeNotifationsToRead}
				>
					All
				</Button>
				<Button
					variant="outline"
					className={cn(
						'font-bold',
						!isAll && 'border-violet-500 text-violet-500 hover:text-violet-500',
					)}
					onClick={handleChangeNotifationsToRead}
				>
					Unreaded
				</Button>
			</div>
			<ul className="mt-4">
				{isAll &&
					notifications?.map(notification => {
						return <NotificationListItem key={notification?.id} notification={notification} />;
					})}
				{!isAll &&
					unreadedNotifications?.map(notification => {
						return <NotificationListItem key={notification?.id} notification={notification} />;
					})}
			</ul>
		</div>
	);
};
