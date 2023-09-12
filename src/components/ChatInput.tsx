"use client"

import React from 'react'
import { Input } from './ui/input'
import { useChat } from 'ai/react'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import Messages from './Messages'

import { useQuery } from '@tanstack/react-query'

type Props = {
	chatId: number
}

const ChatInput = ({ chatId }: Props) => {

	const { input, handleInputChange, handleSubmit, messages } = useChat({
		api: '/api/chat',
		body: {
			chatId
		}
	})

	return (
		<div className='relative max-h-screen'>
			<div className='sticky top-0 inset-x-0 p-2 bg-white h-fit'>
				<h3 className='text-xl font-bold'>Chats</h3>
			</div>


			<Messages messages={messages}/>

			<form onSubmit={handleSubmit} className='sticky bottom-0 inset-x-0 px-2 py-4 bg-white flex flex-row'>
				<Input value={input} onChange={handleInputChange} placeholder='Ask me anything' />
				<Button className='bg-blue-600 ml-2'>
					<Send className='h-4 w-4' />
				</Button>
			</form>
		</div>
	)
}

export default ChatInput;