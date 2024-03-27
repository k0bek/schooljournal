import { PiNumberSquareFiveBold } from 'react-icons/pi';
import { FaRegMessage } from 'react-icons/fa6';
import { PiExam } from 'react-icons/pi';
import { FaHome } from 'react-icons/fa';

export const navigationItems = [
	{ name: 'Home', link: '/home', icon: FaHome },
	{ name: 'Grades', link: '/grades', icon: PiNumberSquareFiveBold },
	{ name: 'Messages', link: '/messages', icon: FaRegMessage },
	{ name: 'Tests', link: '/tests', icon: PiExam },
];
