interface PageHeadingProps {
	text: string;
	subText: string;
}

export const PageHeading = ({ text, subText }: PageHeadingProps) => {
	return (
		<header>
			<p className="flex flex-col text-3xl font-semibold lg:text-5xl">
				{text}
				<span className="text-violet-500">{subText}</span>
			</p>
		</header>
	);
};
