import 'ui/styles/global.css';
import { cn } from 'ui/lib/utils';
import { inter, satoshi } from '../styles/fonts';
import Providers from '../providers/providers';
import { ModeToggle } from './_components/mode-toggle';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { showCurrentUser } from '../api/actions/user/user.queries';
import { Toaster } from 'sonner';

export default async function LocaleLayout({ children }) {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ['user'],
		queryFn: showCurrentUser,
	});

	return (
		<html className={cn(inter.variable, satoshi.variable)}>
			<body className="relative h-screen overflow-auto">
				<Providers>
					<HydrationBoundary state={dehydrate(queryClient)}>
						{children}
						<Toaster richColors />
						<div className="fixed bottom-5 right-5">
							<ModeToggle />
						</div>
					</HydrationBoundary>
				</Providers>
			</body>
		</html>
	);
}
