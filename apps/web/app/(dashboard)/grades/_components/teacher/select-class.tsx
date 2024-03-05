import { useQuery } from '@tanstack/react-query';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../../../../../packages/ui/components/ui/select';
import { showCurrentTeacher } from '../../../../../api/actions/user/user.queries';

interface SelectClassProps {
	selectClassToSearch: (className: string) => void;
}

export const SelectClass = ({ selectClassToSearch }: SelectClassProps) => {
	const { data } = useQuery({
		queryKey: ['class'],
		queryFn: showCurrentTeacher,
	});
	const currentTeacher = data?.currentTeacher;

	return (
		<Select
			onValueChange={value => {
				selectClassToSearch(value);
			}}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select class" />
			</SelectTrigger>
			<SelectContent>
				{currentTeacher?.createdClass.map((classItem, index) => {
					return (
						<SelectItem key={index} value={classItem.className}>
							{classItem?.className}
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
};
