"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Cookies from "js-cookie";

export default function Home() {
  const [customerId, setCustomerId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(null);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([
    "product1",
    "product2",
    "product3",
  ]);
  const [customerID, setCustomerID] = useState<string>("");
  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  useEffect(() => {
    const cookieValue = Cookies.get("customerID");

    if (!cookieValue) {
      // Generate a new random customer ID and set it in the cookie
      const newCustomerID = randomInt(10000, 99999).toString();
      Cookies.set("customerID", newCustomerID);
      setCustomerID(newCustomerID); // Set the state to the new customer ID
    } else {
      setCustomerID(cookieValue);
    }
  }, []);
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/get_items");
      setProducts(response.data.items.slice(0, 100));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const addItem = () => {
    if (selectedProduct && quantity && date) {
      setItems((prevItems) => [
        ...prevItems,
        {
          customerId,
          description: selectedProduct,
          quantity,
          date: date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
          country: "France",
        },
      ]);
      setCustomerId("");
      setSelectedProduct("");
      setQuantity("");
      setDate(null);
      console.log("Items:", items);
    }
  };

  const addProductsToDB = async (products) => {
    try {
      // Ensure products is an array of product objects
      if (!Array.isArray(products)) {
        throw new Error("Invalid input: 'products' should be an array.");
      }

      const response = await axios.post(
        "http://127.0.0.1:5000/add_products",
        products
      );

      console.log(`${response.data.message}`);
      setItems([]);
    } catch (error) {
      console.error("Error adding products:", error);
    }
  };

  const deleteItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center gap-8 py-20 ">
      <Label className="mt-4">
        Hello dear customer, please fill in the form below to submit your
        orders.
      </Label>
      {/* Form */}
      <div className="flex flex-col gap-4 w-[400px]">
        {/* Customer ID Input */}
        <Input
          placeholder="Customer ID (Optional)"
          value={customerId}
          onChange={(e) => {
            if (e.target.value !== "") {
              setCustomerId(e.target.value);
            } else {
              setCustomerId(customerID);
            }
          }}
        />

        {/* Product Selector */}
        <Select
          onValueChange={(value) => setSelectedProduct(value)}
          value={selectedProduct}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product} value={product}>
                {product}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Quantity Input */}
        <Input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
        />

        {/* Calendar Input */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              className={`w-full justify-start ${
                date ? "text-black" : "text-gray-500"
              }`}
            >
              {date ? date.toISOString().split("T")[0] : "Select a Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>

        {/* Add Item Button */}
        <Button
          variant={"default"}
          onClick={addItem}
          disabled={!selectedProduct || !quantity || !date}
        >
          Add Item
        </Button>
      </div>

      {/* Data Table */}
      <div className="overflow-y-auto h-[300px] w-[700px] border border-gray-300 rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.customerId || customerID}</TableCell>
                <TableCell>{item.product}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => deleteItem(index)}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Submit Button */}
      <Button disabled={!items.length} onClick={() => addProductsToDB(items)}>
        Submit to Database
      </Button>
    </div>
  );
}
