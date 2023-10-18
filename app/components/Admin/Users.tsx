"use client";
import React, { use, useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 0,
      name: "",
      email: "",
      isActive: false,
      admin: false,
      newsletter: false,
    },
  ]);
  console.log(users);

  const [count, setCount] = useState(0);

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetch(`/api/user`);
      const data = await res.json();
      console.log(data);
      setUsers(data);
    };
    getUsers();
  }, []);

  useEffect(() => {
    const subscribedUsersCount = users.filter((user) => user.isActive).length;
    setCount(subscribedUsersCount);
  }, [users]);

  const [copiedEmails, setCopiedEmails] = useState(false);

  const copyEmails = () => {
    const emails = users
      .filter((user) => user.newsletter)
      .map((user) => user.email)
      .join(", ");
    navigator.clipboard.writeText(emails);
    setCopiedEmails(true);
    setTimeout(() => {
      setCopiedEmails(false);
    }, 3000);
  };
  return (
    <div className="mt-8">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-[16px]"> Total Users: {users.length}</h1>
          <h1 className="text-[16px]"> Total Subscribed Users: {count}</h1>
        </div>

        <button
          onClick={copyEmails}
          className="text-[16px] hover:line-through text-red-500"
        >
          {copiedEmails ? "Copied!" : "Copy emails"}
        </button>
      </div>
      {users.map((user) => (
        <div key={user.id} className="border-t-[2px] border-black">
          <div className="flex">
            <p className="mt-2 text-[18px] text-slate-500">Email:</p>
            <p className="mt-2 text-[18px] ml-2">{user.email}</p>
          </div>
          <div className="flex">
            <p className="mt-2 text-[18px] text-slate-500">Name:</p>
            <p className="mt-2 text-[18px] ml-2">{user.name}</p>
          </div>
          <div className="flex">
            <p className="mt-2 text-[18px]  text-red-500">
              {user.isActive ? "Subcribed" : "Not subcribed"}
            </p>
          </div>
          <div className="flex">
            <p className="mt-2 text-[18px] mb-4 text-red-300">
              {user.newsletter && "Newsletter"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Users;
