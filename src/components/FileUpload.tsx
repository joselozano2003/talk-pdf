"use client";

import { uploadToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import { Inbox, Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import toast from 'react-hot-toast';

type Props = {}

const FileUpload = () => {
    const [uploading, setUploading] = useState(false)
    const {mutate, isLoading} = useMutation({
        mutationFn: async ({fileKey, fileName}: {fileKey: string, fileName: string}) => {
            const response = await axios.post(`/api/create-chat`,[fileKey, fileName]);
            return response.data;
        }
    })

    const { getRootProps, getInputProps } = useDropzone({
        accept: {"application/pdf": [".pdf"]},
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            console.log(acceptedFiles)
            const file = acceptedFiles[0]

            if (file.size > 10 * 1024 * 1024){
                toast.error('File size exceeds 10MB')
                return
            }

            try {

                setUploading(true)
                const data = await uploadToS3(file)
                if (!data?.fileName || !data?.fileKey) {
                    toast.error('Error uploading file')
                    return
                }
                console.log(data)

                mutate(data, {
                    onSuccess: ({ chatId }) => {
                        toast.success('Chat created')
                        console.log(chatId)
                        window.location.href = `/chat/${chatId}`
                    },
                    onError: (err) => {
                        toast.error('Error creating chat')
                        console.log(data)
                        console.log(err)
                    }

                })
            }
            catch (err) {
                console.log(err)
            }
            finally {
                setUploading(false)
            }

        }
    })

    return (
        <div className='p-2 bg-white rounded-xl'>
            <div {...getRootProps({
                className: ' border-dashed border-2 cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col'
            })}>
                <input {...getInputProps()}/>
                { (uploading || isLoading) ? (
                    <>
                        {/* Loading State */}
                        <Loader2 className='w-10 h-10 text-blue-500 animate-spin'/>
                        <p className='mt-2 text-sm text-slate-400'>Reading Document...</p>
                    </>
                ):(
                    <>
                    </>
                )}
                <>
                    <Inbox className='w-10 h-10 text-blue-500'/>
                    <p className='mt-2 text-sm text-slate-400'>Drop PDF here</p>
                </>
            </div>
        </div>
    )
}

export default FileUpload