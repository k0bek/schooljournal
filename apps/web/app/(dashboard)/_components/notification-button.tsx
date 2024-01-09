import Image from 'next/image';
import { Button } from 'ui';
import notificationIcon from './../../../../web/public/_static/svg/notification.svg';

const NotificationButton = () => {
	return (
		<Button
			variant="outline"
			className="absolute right-4 top-4 h-12 w-12 rounded-full border-[1px] border-violet-200 shadow-lg"
		>
			<Image src={notificationIcon} alt="notification icon" />
		</Button>
	);
};

export default NotificationButton;
