import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3URL } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";

export async function POST(req: NextRequest, res:NextResponse){

    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        const fileKey = body[0];
        const fileName = body[1];

        const pages = await loadS3IntoPinecone(fileKey);

        const chatId = await db.insert(chats).values({
            fileKey,
            pdfName: fileName,
            pdfUrl: getS3URL(fileKey),
            userId,
        }).returning({
            insertedId: chats.id,
        })

        console.log(chatId[0].insertedId);
        return NextResponse.json({chatId: chatId[0].insertedId},{ status: 200 });
    }
    catch(error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal Server Error!" },
            { status: 500 }
        )
    }
}