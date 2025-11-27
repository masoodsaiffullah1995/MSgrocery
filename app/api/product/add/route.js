import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

//configuration of cloudinary

cloudinary.config({
    
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET



})


export async function POST(request) {

    try {

        const {userId} = getAuth(request)

        const isSeller = await authSeller(userId)

        if (!isSeller) {

            return NextResponse.json({success:false,message:'not authorized'})
            
        }

        const fomrData = await request.fomrData()
        
        
    } catch (error) {
        
    }
    
}

