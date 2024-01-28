import moment from 'moment';

interface GuestMessageProps {
	text: string;
	createdAt: string;
}

export const HostMessage = ({ text, createdAt }: GuestMessageProps) => {
	return (
		<div>
			<div>
				<span className="mb-1 block text-right text-sm">
					<span className="block text-right text-sm">
						{moment(createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').fromNow()}
					</span>
				</span>
			</div>
			<p className="ml-auto w-4/6 break-words rounded-xl bg-violet-500 p-2 text-sm text-white">
				{text}
			</p>
		</div>
	);
};
