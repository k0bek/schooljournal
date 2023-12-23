'use client';

import { useEffect, useState } from 'react';
import { RegisterModal } from '../components/modals/register-modal/register-modal';
import { LoginModal } from '../components/modals/login-modal/login-modal';
import { FirstNameLastNameModal } from '../components/modals/firstNameLastName-modal/firstNameLastName-modal';

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
			<FirstNameLastNameModal />
		</>
	);
};

export default ModalProvider;
