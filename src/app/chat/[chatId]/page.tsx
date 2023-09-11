import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

interface Props {
    params: {
        chatId: string
    }
}

const ChatPage = async ({ params: { chatId }}: Props) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect('/sign-in')
    }


    // const chats = await db.select().from()

    return (
        <div>{chatId}</div>
    )
}

export default ChatPage;