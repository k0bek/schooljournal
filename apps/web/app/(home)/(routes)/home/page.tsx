'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { onClose, onOpen } from '../../../../redux/slices/modalSlice';
import { useEffect } from 'react';
import { Navbar } from '../../../../components/home/navbar';

const HomePage = () => {
	const { currentUser } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!currentUser?.firstName || !currentUser?.lastName) {
			dispatch(onOpen('firstNameLastName'));
		} else {
			dispatch(onClose());
		}
	}, []);

	return (
		<div className="px-3 py-5">
			<Navbar />
		</div>
	);
};

export default HomePage;
