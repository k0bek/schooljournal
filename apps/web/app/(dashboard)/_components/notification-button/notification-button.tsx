'use client';

import { Button } from 'ui';
import { IoIosNotifications } from 'react-icons/io';
import { NotificationList } from './notification-list';
import { useEffect, useState } from 'react';
import { RootState } from '../../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useQueryErrorResetBoundary } from '@tanstack/react-query';
import { getAllNotifications } from '../../../../api/actions/notification/notification.queries';
import { assignNotification } from '../../../../redux/slices/notificationSlice';

export const NotificationButton = () => {
	const dispatch = useDispatch();
	const [isNotificationListOpen, setIsNotificationListOpen] = useState(false);
	const { notification } = useSelector((state: RootState) => state.notification);
	const { data, refetch } = useQuery({
		queryKey: ['notification'],
		queryFn: getAllNotifications,
	});
	const [notifications, setNotifications] = useState([]);
	const unreadedNotifications = notifications?.filter(notification => !notification?.readed);

	useEffect(() => {
		if (data?.notifications.length > 0) {
			setNotifications([...data?.notifications]);
		}
		if (notification) {
			setNotifications([...data?.notifications, notification]);
		}
	}, [data?.notifications, notification]);

	const handleNotificationButtonClick = () => {
		refetch();
		setNotifications(data?.notifications);
		dispatch(assignNotification(null));
		setIsNotificationListOpen(prev => !prev);
	};

	return (
		<>
			<Button
				variant="outline"
				className="fixed right-4 top-4 h-12 w-12 rounded-full border-[1px] border-violet-200 shadow-lg"
				onClick={handleNotificationButtonClick}
			>
				{unreadedNotifications?.length > 0 && (
					<div className="absolute -bottom-1 left-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white">
						{unreadedNotifications.length}
					</div>
				)}
				<IoIosNotifications />
			</Button>
			{isNotificationListOpen && <NotificationList notifications={notifications} />}
		</>
	);
};
