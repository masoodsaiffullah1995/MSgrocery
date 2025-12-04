import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/User";
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
    const { cartData } = body || {};

    // 2️⃣ Validate cartData
    if (!cartData || typeof cartData !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid cart data" },
        { status: 400 }
      );
    }

    await connectDB();

    // 3️⃣ Find user
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 4️⃣ Update cart
    user.cartItems = cartData;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update cart" },
      { status: 500 }
    );
  }
}
