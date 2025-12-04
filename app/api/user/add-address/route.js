import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import Address from "@/models/Address";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    // 1️⃣ Auth check
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { address } = body || {};

    // 2️⃣ Validate existence of address object
    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address data missing" },
        { status: 400 }
      );
    }

    const { fullName, phoneNumber, pincode, area, city, state } = address;

    // 3️⃣ Required field validation
    if (
      !fullName ||
      !phoneNumber ||
      !pincode ||
      !area ||
      !city ||
      !state
    ) {
      return NextResponse.json(
        { success: false, message: "All address fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 4️⃣ Save new address document
    const newAddress = await Address.create({
      userId,
      fullName,
      phoneNumber,
      pincode,
      area,
      city,
      state,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Address added successfully",
        address: newAddress,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/user/add-address ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
