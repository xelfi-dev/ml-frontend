"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export default function ProfilePage() {
  const [customerId, setCustomerId] = useState("");
  const [rfmValues, setRfmValues] = useState<{
    Recency: number;
    Frequency: number;
    Monetary: number;
  } | null>(null);

  const [isError, setIsError] = useState(false); // Track error state
  const [errorMessage, setErrorMessage] = useState(""); // Store the error message

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  useEffect(() => {
    const cookieValue = Cookies.get("customerID");
    console.log(cookieValue);

    if (!cookieValue) {
      // Generate a new random customer ID and set it in the cookie
      const newCustomerID = randomInt(10000, 99999).toString();
      Cookies.set("customerID", newCustomerID);
      setCustomerId(newCustomerID); // Set the state to the new customer ID
    } else {
      setCustomerId(cookieValue);
    }
  }, []);

  interface RFMValues {
    Recency: number;
    Frequency: number;
    Monetary: number;
  }

  const handleGetRFM = async (customerId: string): Promise<void> => {
    try {
      // Clear previous RFM values before fetching new data
      setRfmValues(null);
      console.log(customerId);

      // Make an API call to fetch RFM values
      const response = await axios.get<RFMValues>(
        `https://ml-project-backend-o0qp.onrender.com/get_rfm/${customerId}`
      );

      // Update the state with the fetched RFM values
      setRfmValues(response.data);
      setIsError(false); // Reset error state if successful
    } catch (error) {
      console.error("Error fetching RFM values:", error);
      setErrorMessage("Invalid customer ID"); // Set the error message
      setIsError(true); // Set the error state to true
    }
  };

  // Function to generate a customer profile description based on RFM values
  const generateCustomerProfile = () => {
    if (!rfmValues) return null;

    const { Recency, Frequency, Monetary } = rfmValues;
    let profileDescription = "Profile: ";
    if (Frequency > 15 && Recency && Monetary) {
      profileDescription += "Loyal Customer";
    } else if (Frequency > 5) {
      profileDescription += "Occasional Shopper";
    } else {
      profileDescription += "New Customer";
    }

    return profileDescription;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 text-white p-6">
      <Label>
        If you have another CustomerID, change it below, otherwise click the
        button to get your RFM values.
      </Label>
      <div className="flex flex-col items-center space-y-4 w-[400px]">
        <Input
          type="text"
          placeholder="Enter your Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full"
        />
        <Button
          onClick={() => {
            handleGetRFM(customerId);
          }}
          className="w-full"
        >
          Get RFM & Customer Profile
        </Button>
      </div>
      <div className="min-h-[300px]">
        <div className="mt-6">
          {rfmValues && (
            <div className="p-4 bg-[#282828] rounded-lg shadow-lg text-center space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold">RFM Values</h2>
                <p>
                  <strong>Recency:</strong>{" "}
                  {rfmValues.Recency > 0 ? rfmValues.Recency : 0}
                </p>
                <p>
                  <strong>Frequency:</strong> {rfmValues.Frequency}
                </p>
                <p>
                  <strong>Monetary:</strong> ${rfmValues.Monetary.toFixed(2)}
                </p>
              </motion.div>
            </div>
          )}
          {/* Customer Profile Description */}
          {rfmValues && (
            <div className="mt-6 p-4 bg-[#282828] rounded-lg shadow-lg text-center space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold">Customer Profile</h3>
                <p className="text-sm text-gray-400">
                  {generateCustomerProfile()}
                </p>
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
