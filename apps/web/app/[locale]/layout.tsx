import 'ui/styles/global.css';

import { notFound } from 'next/navigation';
import { Background } from 'ui/background';
import { cn } from 'ui/lib/utils';
import { inter, satoshi } from "../../styles/fonts"
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '../../components/providers/theme-provider';

const locales = ['en', 'pl'];

export default async function LocaleLayout({ children, params: { locale } }) {
	let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

	return (
		<html lang={locale} className={cn(inter.variable, satoshi.variable)}>
				<body className="overflow-auto">
			<NextIntlClientProvider messages={messages}>
			<ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false} storageKey='journal-theme'>
			<Background />
			{children}
			</ThemeProvider>
			</NextIntlClientProvider>
			</body>
		</html>
	);
}
