'use client';

import { useEffect, useState } from 'react';
import { RegisterModal } from '../modals/register-modal/register-modal';
import { LoginModal } from '../modals/login-modal/login-modal';

const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			<RegisterModal />
			<LoginModal />
		</>
	);
};

export default ModalProvider;
