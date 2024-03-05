import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../../../../../packages/ui/components/ui/select';

interface SelectStudentProps {
	classStudents: {
		firstName: string;
		lastName: string;
		id: string;
	}[];
	selectStudentToSearch: (studentId: string) => void;
}

export const SelectStudent = ({ classStudents, selectStudentToSearch }: SelectStudentProps) => {
	return (
		<Select
			onValueChange={value => {
				selectStudentToSearch(value);
			}}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select student" />
			</SelectTrigger>
			<SelectContent>
				{classStudents.length !== 0 ? (
					classStudents.map((classItem, index) => {
						return (
							<SelectItem key={index} value={classItem.id}>
								{classItem.firstName + ' ' + classItem.lastName}
							</SelectItem>
						);
					})
				) : (
					<SelectItem value="none">There are no students here</SelectItem>
				)}
			</SelectContent>
		</Select>
	);
};
