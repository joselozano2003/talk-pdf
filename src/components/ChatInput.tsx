"use client"

import React, { useEffect } from 'react'
import { Input } from './ui/input'
import { useChat } from 'ai/react'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import Messages from './Messages'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { Message } from "ai";

type Props = {
	chatId: number
}

const ChatInput = ({ chatId }: Props) => {

	const { data, isLoading } = useQuery({
		queryKey: ["chat", chatId],
		queryFn: async () => {
		  	const response = await axios.post< Message[] >("/api/get-messages", { chatId });
		  	return response.data;
		},
	});

	const { input, handleInputChange, handleSubmit, messages } = useChat({
		api: '/api/chat',
		body: {
			chatId
		},
		initialMessages: data || []
	})

	useEffect(() => {
		const messageContainer = document.getElementById('message-container')
		if (messageContainer) {
			messageContainer.scrollTo ({
				top: messageContainer.scrollHeight,
				behavior: 'smooth'
			})
		}
	}, [messages])

	return (
		<div className='relative max-h-screen' id='message-container'>
			<div className='sticky top-0 inset-x-0 p-2 bg-white h-fit'>
				<h3 className='text-xl font-bold'>Chats</h3>
			</div>


			<Messages messages={messages} isLoading={isLoading}/>

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