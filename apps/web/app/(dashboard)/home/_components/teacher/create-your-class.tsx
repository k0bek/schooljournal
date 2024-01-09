'use client';

import Lottie from 'lottie-react';
import animationData from './../../../../../public/animations/class.json';
import { Button } from 'ui';
import { useDispatch } from 'react-redux';
import { onOpen } from '../../../../../redux/slices/modalSlice';

export const CreateYourClass = () => {
	const dispatch = useDispatch();
	return (
		<section className="flex flex-col items-start">
			<div className="w-full text-center md:w-1/2">
				<h2 className="mt-5 text-3xl font-extralight text-violet-600 md:text-4xl lg:mt-10 lg:text-[2.5rem]">
					Create your <span className="text-black dark:text-white"> class!</span>
				</h2>
				<div className="w-full">
					<Lottie className="-mt-6 w-full" animationData={animationData} />
					<Button
						className="w-4/5 rounded-xl py-3 md:py-4 md:text-lg lg:py-6"
						variant="default"
						onClick={() => {
							dispatch(onOpen('createClass'));
						}}
					>
						Create a class
					</Button>
				</div>
			</div>
		</section>
	);
};
