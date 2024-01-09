import { QueryClient } from '@tanstack/react-query';
import { NavbarDesktop } from './_components/navbar-desktop';
import { NavbarMobile } from './_components/navbar-mobile';
import NotificationButton from './_components/notification-button';
import { getClasses } from '../../api/actions/class/class.queries';

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ['classes'],
		queryFn: getClasses,
	});
	return (
		<div className="lg:flex">
			<NavbarMobile />
			<NavbarDesktop />
			<NotificationButton />
			{children}
		</div>
	);
};

export default HomeLayout;
