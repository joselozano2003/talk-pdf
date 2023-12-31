import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { auth } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'

import ChatSideBar from '@/components/ChatSideBar'
import PDFViewer from '@/components/PDFViewer'
import ChatInput from '@/components/ChatInput'
import { checkSubscription } from '@/lib/subscription'

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


    const _chats = await db.select().from(chats).where(eq(chats.userId, userId)).execute()

    if (!_chats.length) {
        return redirect('/')
    }

    if (!_chats.find(chat => chat.id === parseInt(chatId))) {
        return redirect('/')
    }
    const isPro = await checkSubscription()

    const currentChat = _chats.find(chat => chat.id === parseInt(chatId))
    return (
        <div className="flex min-h-screen">
            <div className="flex w-full min-h-screen">
                {/* chat sidebar */}
                <div className="flex-[1] min-w-max min-h-screen overflow-scroll">
                    <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
                </div>
                {/* pdf viewer */}
                <div className="max-h-screen p-4 overflow-scroll flex-[5]">
                    <PDFViewer pdfUrl={currentChat?.pdfUrl || ""} />
                </div>
                {/* chat component */}
                <div className="flex-[3] border-l-4 border-l-slate-200 overflow-scroll">
                    <ChatInput chatId={parseInt(chatId)} />
                </div>
            </div>
        </div>

    )
}

export default ChatPage;