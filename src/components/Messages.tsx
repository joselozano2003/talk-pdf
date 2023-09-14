import { cn } from '@/lib/utils'
import { Message } from 'ai/react'
import { Loader2 } from 'lucide-react';
import React from 'react'

type Props = {
    messages: Message[];
    isLoading: boolean;
}

const Messages = ({ messages, isLoading}: Props) => {

    if (!messages){
        return <></>
    }

    if (isLoading) {
        console.log('loading')
        return (
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <Loader2 className='h-66' />
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-2 px-4 pb-1'>
            {messages.map((message) => {
                return(
                    <div key={message.id} className={cn('flex', {
                        'justify-end': message.role === 'user',
                        'justify-start': message.role === 'assistant',
                    })}>
                        <div className={cn('rounded-lg px-3 text-sm py-1 shadow-md ring-gray-900/10', {
                            'bg-blue-600 text-white': message.role === 'user',
                            'bg-slate-200 text-slate-800': message.role === 'assistant'
                        })}>
                            <p>{message.content}</p>
                        </div>
                    </div>
                )})
            }
        </div>
    )
}
export default Messages;