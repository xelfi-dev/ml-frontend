"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function RecommendationsPage() {
  const [customerId, setCustomerId] = useState("");
  const [recommendations, setRecommendations] = useState<string[] | null>(null);

  const [isError, setIsError] = useState(false); // Track error state
  const [errorMessage, setErrorMessage] = useState(""); // Store the error message

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

    try {
      // Simulate fetching recommendations for the customer ID
      // Simulate an error scenario by throwing an error
      throw new Error("Failed to fetch recommendations");

      // Normally, you would make an API call to fetch recommendations here
      const mockRecommendations = [
        "Product A - Recommended based on your purchase history",
        "Product B - Might interest you based on your preferences",
        "Product C - Highly rated by customers like you",
      ];
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setErrorMessage(
        "There was an error fetching the recommendations. Please check your customer ID and try again."
      );
      setIsError(true); // Show the error dialog
    }
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
            <div className="p-4 bg-[#282828] rounded-lg shadow-lg text-center space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
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
            </div>
          )}
        </div>
      </div>

      {/* Error Dialog */}
      <Dialog open={isError} onOpenChange={() => setIsError(false)}>
        <DialogContent className="bg-[#1F1F1F] text-white p-8">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="text-center">
            <p>{errorMessage}</p>
            <DialogClose asChild>
              <Button className="mt-4 w-full">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
