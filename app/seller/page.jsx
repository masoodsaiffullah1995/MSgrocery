"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const AddProduct = () => {
  // You can also use isSeller to conditionally show this form if needed
  const { isSeller } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Potato"); // ✅ default veg category
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.length) {
      toast.error("Please upload at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]); // ✅ matches backend: formData.getAll("images")
    }

    try {
      const { data } = await axios.post("/api/product/add", formData);

      if (data.success) {
        toast.success(data.message || "Product added");

        // reset form
        setFiles([]);
        setName("");
        setDescription("");
        setCategory("Potato");
        setPrice("");
        setOfferPrice("");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        {/* Images */}
        <div>
          <p className="text-base font-medium">Vegetable Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input
                  onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files[0];
                    setFiles(updatedFiles);
                  }}
                  type="file"
                  id={`image${index}`}
                  hidden
                  accept="image/*"
                />
                <Image
                  className="max-w-24 cursor-pointer"
                  src={
                    files[index]
                      ? URL.createObjectURL(files[index])
                      : assets.upload_area
                  }
                  alt="Upload vegetable"
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Vegetable Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="e.g. Fresh Organic Tomato"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Describe freshness, origin, quality, etc."
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>

        {/* Category + Prices */}
        <div className="flex items-center gap-5 flex-wrap">
          {/* Category */}
          <div className="flex flex-col gap-1 w-40">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="Potato">Potato</option>
              <option value="Tomato">Tomato</option>
              <option value="Onion">Onion</option>
              <option value="Carrot">Carrot</option>
              <option value="Cabbage">Cabbage</option>
              <option value="Cauliflower">Cauliflower</option>
              <option value="Spinach">Spinach</option>
              <option value="Broccoli">Broccoli</option>
              <option value="Peas">Peas</option>
              <option value="Cucumber">Cucumber</option>
              <option value="Brinjal">Brinjal</option>
              <option value="Beans">Beans</option>
              <option value="Capsicum">Capsicum</option>
              <option value="Pumpkin">Pumpkin</option>
              <option value="Garlic">Garlic</option>
              <option value="Ginger">Ginger</option>
              <option value="Green Chili">Green Chili</option>
            </select>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Price (MRP)
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              min="0"
              step="0.01"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>

          {/* Offer Price */}
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              min="0"
              step="0.01"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
