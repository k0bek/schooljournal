import { ReactNode } from 'react';

export const runtime = 'edge';

export default function AuthLayout({ children }: { children: ReactNode }) {
	return <div className="flex h-screen w-screen justify-center">{children}</div>;
}
