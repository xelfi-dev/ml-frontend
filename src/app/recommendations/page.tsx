"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";

export default function RecommendationsPage() {
  const [customerId, setCustomerId] = useState("");
  const [recommendations, setRecommendations] = useState<string[] | null>(null);

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  useEffect(() => {
    const cookieValue = Cookies.get("customerID");

    if (!cookieValue) {
      // Generate a new random customer ID and set it in the cookie
      const newCustomerID = randomInt(10000, 99999).toString();
      Cookies.set("customerID", newCustomerID);
      setCustomerId(newCustomerID); // Set the state to the new customer ID
    } else {
      setCustomerId(cookieValue);
    }
  }, []);

  const handleGetRecommendations = () => {
    // Clear previous recommendations before fetching new data
    setRecommendations(null);

    // Simulate fetching recommendations for the customer ID
    const mockRecommendations = [
      "Product A - Recommended based on your purchase history",
      "Product B - Might interest you based on your preferences",
      "Product C - Highly rated by customers like you",
    ];
    setRecommendations(mockRecommendations);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 text-white p-6">
      <Label>
        Enter your customer ID below to get personalized recommendations.
      </Label>
      <div className="flex flex-col items-center space-y-4 w-[400px]">
        <Input
          type="text"
          placeholder="Enter your Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full"
        />
        <Button onClick={handleGetRecommendations} className="w-full">
          Get Recommendations
        </Button>
      </div>
      <div className="min-h-[300px]">
        <div className="mt-6">
          {recommendations && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-4 bg-[#282828] rounded-lg shadow-lg text-center space-y-2"
            >
              <h2 className="text-xl font-semibold">Your Recommendations</h2>
              <ul className="space-y-2 text-left">
                {recommendations.map((item, index) => (
                  <li key={index} className="text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
