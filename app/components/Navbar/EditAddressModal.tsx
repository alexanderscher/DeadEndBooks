"use client";
import React, { useState } from "react";

interface Props {
  setAddyModal: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  address: {
    id: number;
    userId: number;
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
    phone: string;
  };
}

const EditAddressModal = ({ setAddyModal, userId, address }: Props) => {
  const [formData, setFormData] = useState({
    id: address.id,
    name: address.name,
    address: address.address,
    zipCode: address.zipcode,
    city: address.city,
    state: address.state,
    country: address.country,
    phone: address.phone,
  });

  const [errorText, setErrorText] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const addressEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await fetch(`/api/user/address`, {
      method: "PUT",
      body: JSON.stringify({
        id: address.id,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipcode: formData.zipCode,
        phone: formData.phone,
        userId: userId,
      }),
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
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="p-8 z-50 max-w-[700px] w-3/4 bg-red-100 h-[430px] rounded-md border-black border-[2px] shadow-lg">
        <form>
          <input
            type="text"
            name="name"
            placeholder={"Name"}
            value={formData.name}
            onChange={handleChange}
            className="bg-red-100  border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[18px] mt-2 w-full focus:outline-none"
          />
          <input
            type="text"
            name="address"
            placeholder={"Address"}
            value={formData.address}
            onChange={handleChange}
            className="bg-red-100  border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[18px] mt-2 w-full focus:outline-none"
          />
          <input
            type="text"
            name="zipCode"
            placeholder={"Zipcode"}
            value={formData.zipCode}
            onChange={handleChange}
            className="bg-red-100 border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[18px] mt-2 w-full focus:outline-none"
          />
          <input
            type="text"
            name="city"
            placeholder={"City"}
            value={formData.city}
            onChange={handleChange}
            className="bg-red-100 border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[18px] mt-2 w-full focus:outline-none"
          />
          <input
            type="text"
            name="state"
            placeholder={"State"}
            value={formData.state}
            onChange={handleChange}
            className="bg-red-100 border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[18px] mt-2 w-full focus:outline-none"
          />
          <input
            type="text"
            name="country"
            placeholder={"Country"}
            value={formData.country}
            onChange={handleChange}
            className="bg-red-100 border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[18px] mt-2 w-full focus:outline-none"
          />
          <input
            type="text"
            name="phone"
            placeholder={"Phone"}
            value={formData.phone}
            onChange={handleChange}
            className="bg-red-100 border-black text-[20px] border-b-[2px] placeholder:text-black placeholder:text-[18px] mt-2 w-full focus:outline-none"
          />
          {errorText && (
            <p className="text-red-800 mt-2">Please fill out all fields</p>
          )}
          <div className="flex  justify-between mt-4">
            <button
              onClick={(e) => addressEdit(e)}
              className="text-start text-red-500 hover:line-through text-[20px] "
            >
              Submit
            </button>
            <button
              className="text-start text-red-500 hover:line-through text-[20px]"
              onClick={() => setAddyModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAddressModal;
