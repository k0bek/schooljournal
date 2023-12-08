'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Background } from 'ui/background';
import { ThemeProvider } from './theme-provider';

const Providers = ({ children }: { children: ReactNode }) => {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				enableSystem={false}
				storageKey="journal-theme"
			>
				<Background />
				{children}
			</ThemeProvider>
		</QueryClientProvider>
	);
};

export default Providers;
