'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Background } from 'ui/background';
import { ThemeProvider } from './theme-provider';
import { Provider } from 'react-redux';
import { store } from './../../redux/store';
import ModalProvider from './modal-provider';

const Providers = ({ children }: { children: ReactNode }) => {
	const queryClient = new QueryClient();
	return (
		<Provider store={store}>
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
				<ModalProvider />
			</QueryClientProvider>
		</Provider>
	);
};

export default Providers;
