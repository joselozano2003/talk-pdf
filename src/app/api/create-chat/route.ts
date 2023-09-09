import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res:NextResponse){
    try {
        const body = await req.json();
        const { fileKey, fileName } = body;
    }
    catch(error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal Server Error!" },
            { status: 500 }
        )
    }
}