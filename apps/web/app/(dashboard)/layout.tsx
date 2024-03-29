import { QueryClient } from '@tanstack/react-query';
import { NavbarDesktop } from './_components/navbar-desktop';
import { NavbarMobile } from './_components/navbar-mobile';
import { getClasses } from '../../api/actions/class/class.queries';
import { showCurrentStudent } from '../../api/actions/user/user.queries';

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ['classes'],
		queryFn: getClasses,
	});
	await queryClient.prefetchQuery({
		queryKey: ['currentStudent'],
		queryFn: showCurrentStudent,
	});

	return (
		<div className="lg:flex">
			<NavbarMobile />
			<NavbarDesktop />
			{children}
		</div>
	);
};

export default HomeLayout;
