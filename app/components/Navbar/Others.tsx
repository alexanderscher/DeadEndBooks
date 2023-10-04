"use client";
import React, { use, useEffect, useState } from "react";

const Others = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      const res = await fetch("/api/user/other");
      const data = await res.json();
      console.log(data);
      setUsers(data);
    };
    getUsers();
  }, []);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id} className="mb-10 border-t-[2px] border-black">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <p>Current:</p>
          {user.current_books.map((book) => (
            <div>{book.title}</div>
          ))}
          <p>Past:</p>
          {user.past_books.map((book) => (
            <div>{book.title}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Others;
