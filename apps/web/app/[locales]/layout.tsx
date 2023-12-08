import 'ui/styles/global.css';
import { notFound } from 'next/navigation';
import { cn } from 'ui/lib/utils';
import { inter, satoshi } from '../../styles/fonts';
import Providers from '../../components/providers/providers';
import { NextIntlClientProvider } from 'next-intl';

export default async function LocaleLayout({ children, params: { locales } }) {
	let messages;
	try {
		messages = (await import(`../../messages/${locales}.json`)).default;
	} catch (error) {
		notFound();
	}

	return (
		<NextIntlClientProvider messages={messages}>
			<html lang={locales} className={cn(inter.variable, satoshi.variable)}>
				<body className="overflow-auto">
					<Providers>{children}</Providers>
				</body>
			</html>
		</NextIntlClientProvider>
	);
}
