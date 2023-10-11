"use client";
import React, { useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 0,
      name: "",
      email: "",
      isActive: false,
      admin: false,
    },
  ]);
  useEffect(() => {
    const getUsers = async () => {
      const res = await fetch(`/api/user`);
      const data = await res.json();
      console.log(data);
      setUsers(data);
    };
    getUsers();
  }, []);
  return (
    <div className="mt-10">
      {users.map((user) => (
        <div key={user.id} className="border-t-[2px] border-black">
          <div className="flex">
            <p className="mt-4 text-[20px] text-slate-500">Email:</p>
            <p className="mt-4 text-[20px] ml-2">{user.email}</p>
          </div>
          <div className="flex">
            <p className="mt-4 text-[20px] text-slate-500">Name:</p>
            <p className="mt-4 text-[20px] ml-2">{user.name}</p>
          </div>
          <div className="flex">
            <p className="mt-4 text-[20px] mb-4 text-red-500">
              {user.isActive ? "Subcribed" : "Not subcribed"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Users;
