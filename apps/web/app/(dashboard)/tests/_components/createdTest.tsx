import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'ui/components/ui/tooltip';
import { cn } from 'ui/lib/utils';

interface CreatedTestProps {
	topic: string;
	subjectName: string;
	className: string;
}

const getRandomColor = () => {
	const colors = [
		'bg-orange-600',
		'bg-green-600',
		'bg-rose-600',
		'bg-indigo-600',
		'bg-blue-600',
		'bg-sky-600',
		'bg-emerald-600',
		'bg-lime-600',
	];

	return colors[Math.floor(Math.random() * colors.length)];
};

export const CreatedTest = ({ topic, subjectName, className }: CreatedTestProps) => {
	const randomColor = getRandomColor();
	return (
		<div className={cn(randomColor, 'rounded-full px-4 py-2 text-xs text-white md:text-sm')}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>{subjectName}</TooltipTrigger>
					<TooltipContent>
						<p>Topic: {topic}</p>
						<p>Class: {className}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};
