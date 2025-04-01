import {prisma} from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest){
    try{
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")

        if(!userId){
            return NextResponse.json({error:"Missing userId."}, {status:400})
        }

        const profile = await prisma?.profile.findUnique({
            where: {userId},
            select: {subscriptionActive: true},
        });
        console.log(profile?.subscriptionActive)
        return NextResponse.json({
            subscriptionActive: profile?.subscriptionActive,

        });

    }catch(error:any){
        return NextResponse.json({error: "check-subscription Error.", }, {status:500});
    }
}