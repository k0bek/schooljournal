import { useQuery } from '@tanstack/react-query';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from 'ui/components/ui/select';
import { showCurrentTeacher } from '../../../../api/actions/user/user.queries';
import { useDispatch } from 'react-redux';
import { assignClassId } from '../../../../redux/slices/classIdSlice';

interface SelectClassProps {
	setChoosedClassId: React.Dispatch<React.SetStateAction<string>>;
}

export const SelectClass = ({ setChoosedClassId }: SelectClassProps) => {
	const dispatch = useDispatch();
	const { data } = useQuery({
		queryKey: ['class'],
		queryFn: showCurrentTeacher,
	});
	const currentTeacher = data?.currentTeacher;

	const handleClassId = (classId: string) => {
		setChoosedClassId(classId);
	};

	return (
		<Select
			onValueChange={value => {
				handleClassId(value);
				dispatch(assignClassId(value));
			}}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select class" />
			</SelectTrigger>
			<SelectContent>
				{currentTeacher?.createdClass.map((classItem, index) => {
					return (
						<SelectItem key={index} value={classItem.id}>
							{classItem?.className}
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
};
