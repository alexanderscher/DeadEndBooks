"use client";
import React, { useState } from "react";

interface Props {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
}

const AddressModal = ({ setModal, userId }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    zipCode: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    userId,
  });
  console.log(formData);
  const [errorText, setErrorText] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      Object.entries(formData).every(
        ([key, value]) => key === "userId" || value === ""
      )
    ) {
    } else {
      const res = await fetch("/api/user/address", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setErrorText(false);
        location.reload();
      } else {
        console.error("Error submitting address:", data.message);
        setErrorText(true);
      }
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="p-8 z-50 max-w-[700px] w-3/4 bg-red-100 h-[430px] rounded-md border-black border-[2px] shadow-lg">
        <form onSubmit={submitAddress}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="bg-red-100  border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[18px] mt-2 w-full focus:outline-none"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="bg-red-100  border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[18px] mt-2 w-full focus:outline-none"
          />
          <input
            type="text"
            name="zipCode"
            placeholder="Zip Code"
            value={formData.zipCode}
            onChange={handleChange}
            className="bg-red-100 border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[18px] mt-2 w-full focus:outline-none"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="bg-red-100 border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[18px] mt-2 w-full focus:outline-none"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="bg-red-100 border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[18px] mt-2 w-full focus:outline-none"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className="bg-red-100 border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[18px] mt-2 w-full focus:outline-none"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="bg-red-100 border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[18px] mt-2 w-full focus:outline-none"
          />
          {errorText && (
            <p className="text-red-800 mt-2">Please fill out all fields</p>
          )}
          <div className="flex  justify-between mt-4">
            <button
              type="submit"
              className="text-start text-red-500 hover:line-through text-[20px] "
            >
              Submit
            </button>
            <button
              type="submit"
              className="text-start text-red-500 hover:line-through text-[20px]"
              onClick={() => setModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
