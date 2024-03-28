'use client';

import { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Background } from 'ui/background';
import { ThemeProvider } from './theme-provider';
import { Provider, useDispatch } from 'react-redux';
import { store, persistor } from '../redux/store';
import ModalProvider from './modal-provider';
import { PersistGate } from 'redux-persist/integration/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import UserProvider from './user-provider';

const Providers = ({ children }: { children: ReactNode }) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// With SSR, we usually want to set some default staleTime
						// above 0 to avoid refetching immediately on the client
						staleTime: 60 * 1000,
					},
				},
			}),
	);

	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<PersistGate loading={null} persistor={persistor}>
					<UserProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="dark"
							enableSystem={false}
							storageKey="journal-theme"
						>
							<Background />
							{children}
						</ThemeProvider>
					</UserProvider>
					<ModalProvider />
				</PersistGate>
			</QueryClientProvider>
		</Provider>
	);
};

export default Providers;
