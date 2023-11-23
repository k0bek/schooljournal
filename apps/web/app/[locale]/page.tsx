import { useTranslations } from 'next-intl';
import { Button } from 'ui';

export default function Page() {
	const t = useTranslations('Index');
	return (
		<>
			<Button>{t('title')}</Button>
		</>
	);
}
