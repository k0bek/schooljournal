import { QueryClient } from '@tanstack/react-query';
import { GradesTable } from './_components/grades-table';
import { getClasses } from '../../../api/actions/class/class.queries';

const GradesPage = async () => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ['class'],
		queryFn: getClasses,
	});
	return (
		<div className="w-full flex-col px-5 pb-20 lg:ml-64 lg:flex lg:gap-12 lg:py-5">
			<p className="text-3xl font-semibold lg:text-5xl">
				Your <span className="text-violet-500">grades</span>
			</p>
			<GradesTable />
		</div>
	);
};

export default GradesPage;
