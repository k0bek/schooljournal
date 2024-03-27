import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from '../../../../../../packages/ui/components/ui/pagination';

interface PaginationSectionProps {
	totalItems: any;
	itemsPerPage: any;
	currentPage: any;
	setCurrentPage: any;
}

export const PaginationSection = ({
	totalItems,
	itemsPerPage,
	currentPage,
	setCurrentPage,
}: PaginationSectionProps) => {
	const pageNumbers = [];
	for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
		pageNumbers.push(i);
	}

	const handleNextPage = () => {
		if (currentPage < pageNumbers.length) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};
	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={() => {
							handlePrevPage();
						}}
					/>
				</PaginationItem>
				<PaginationItem>
					<PaginationNext
						onClick={() => {
							handleNextPage();
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};
