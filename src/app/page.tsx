import { Button } from '@/components/ui/button'
import { UserButton, auth } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowRight, LogIn, Subscript } from 'lucide-react'
import FileUpload from '@/components/FileUpload'

import { db } from "@/lib/db";
import { chats } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { checkSubscription } from '@/lib/subscription'
import SubscriptionButton from '@/components/SubscriptionButton'

//29.09
export default async function Home() {

	let firstChatId;

	const { userId } : { userId: string | null } = auth();

	const isAuth = !!userId

	if (userId) {
		firstChatId = await db.select().from(chats).where(eq(chats.userId, userId!))
		console.log(firstChatId)
		if (firstChatId){
			firstChatId = firstChatId[0]
			console.log(firstChatId)
		}
	}

	const isPro = await checkSubscription()

	return (
		<div className='w-screen min-h-screen bg-gradient-to-r from-white via-cyan-400 to-rose-100'>
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<div className="flex flex-col items-center text-center">
					<div className="flex items-center">
						<h1 className='mr-3 text-4xl font-semibold'>Talk to your PDF</h1>
						<UserButton afterSignOutUrl='/'/>
					</div>

					<div className='flex mt-2'>
						{isAuth && firstChatId &&
							<div className='flex flex-row'>
								<div className='mr-3'>
									<SubscriptionButton isPro={isPro}/>
								</div>
					
								<Link href={`/chat/${firstChatId.id}`}>
									<Button>Go to Chats <ArrowRight className='ml-2'/></Button>
								</Link>
							</div>
						}
					</div>

					<p className='max-w-xl mt-2 text-lg text-slate-600'>Join hundreds of students, professor and researchers to understand documents in matter of seconds</p>

					<div className='w-full mt-4'>
						{isAuth ? (
							<FileUpload/>
						) : (
							<Link href={`/sign-in`}>
								<Button>
									Login to Get Started
									<LogIn className='w-4 h-4 ml-2'/>
								</Button>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
