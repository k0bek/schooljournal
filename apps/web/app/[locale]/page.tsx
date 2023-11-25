'use client'

import { useTranslations } from 'next-intl';
import Lottie from "lottie-react";
import animationData from './../../public/animations/school-animation.json'
import { Button } from 'ui';
import { FcGoogle } from "react-icons/fc";
import Link from 'next/link';
import { ModeToggle } from '../../components/mode-toggle';



export default function HomePage() {
  const t = useTranslations('Index');
  return (
      <main className='min-h-screen flex items-center justify-center mx-auto max-w-lg'>
		<div className='flex flex-col h-full p-4 justify-center xl:flex-row xl:items-center xl:gap-10'>
		<div className='mx-auto w-full mb-5 lg:w-[40rem] xl:w-[68rem]'>
		<Lottie 
        animationData={animationData}
      />
	  </div>
		<div className='text-left font-bold'>
		<h1 className="text-5xl drop-shadow-md">{t("The best school journal for your needs!")}</h1>
		<p className='text-2xl text-violet-600 mt-1 mb-7 dark:text-violet-500'>{t("Join today")}</p>
		<div className='flex flex-col gap-2'>
		<Button className='w-full py-6 rounded-full gap-2 text-lg' variant='outline'><FcGoogle className='text-2xl'/>{t("Sign up with Google")}</Button>
		<div className='flex items-center justify-center gap-2'>
			<hr className='w-full h-[2px] bg-violet-600'/>
			<span>{t('or')}</span>
			<hr className='w-full h-[2px] bg-violet-600'/>
		</div>
		<Button className='w-full py-6 rounded-full text-lg'>{t("Create an account")}</Button>
		</div>
		<div className='mt-7'>
		<p className='mb-2 font-medium'>{t("Do you already have an account?")}</p>
		<Button className='w-full py-6 rounded-full text-lg' variant="secondary">
			<Link className='w-full' href='/login'>{t('Log in')}</Link>
		</Button>
		<div className='absolute bottom-5 left-5'>
		<ModeToggle/>
		</div>
		</div>
		</div>
	  </div>
	  </main>
  )
}
