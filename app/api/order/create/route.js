import connectDB from "@/config/db";
import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // 1) Connect to DB
    await connectDB();

    // 2) Auth check
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // 3) Read body
    const { address, items } = await request.json();

    if (!address || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid data" },
        { status: 400 }
      );
    }

    // 4) Calculate amount using items (correct async logic)
    let amount = 0;

    for (const item of items) {
      if (!item?.product || !item?.quantity) continue;

      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message: `Product not found for id: ${item.product}`,
          },
          { status: 400 }
        );
      }

      const price = product.offerPrice ?? product.price;
      amount += price * item.quantity;
    }

    const totalAmount = amount + Math.floor(amount * 0.02); // +2% tax

    // 5) Send Inngest event (matches your createUserOrder handler)
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: totalAmount,
        date: Date.now(),
      },
    });

    // 6) Clear user cart
    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    // 7) Respond
    return NextResponse.json(
      { success: true, message: "Order Placed", amount: totalAmount },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/order/create ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
