'use client';

import { useEffect, useState } from 'react';
import { RegisterModal } from '../components/modals/register-modal/register-modal';
import { LoginModal } from '../components/modals/login-modal/login-modal';
import { FirstNameLastNameModal } from '../components/modals/firstNameLastName-modal/first-name-last-name-modal';
import { VerifyModal } from '../components/modals/verify-modal/verify-modal';
import { UpdateUserModal } from '../components/modals/update-user-modal/update-user-modal';
import { CreateClassModal } from '../components/modals/create-class-modal/create-class-modal';
import { AddGradeModal } from '../components/modals/add-grade-modal/add-grade-modal';
import { AddTestModal } from '../components/modals/add-test-modal/add-test-modal';

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
			<VerifyModal />
			<UpdateUserModal />
			<CreateClassModal />
			<AddGradeModal />
			<AddTestModal />
		</>
	);
};

export default ModalProvider;
