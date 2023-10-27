"use client";
import { Book } from "@/types";
import { get } from "http";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

type Obj = {
  name: string;
  current: Array<Book>;
  history: Array<Book>;
};

const User = () => {
  const currentPage = usePathname();
  const userId = currentPage.split("/")[2];

  const [user, setUser] = useState<Obj>({
    name: "",
    current: [],
    history: [],
  });
  console.log(user);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/other-users/${userId}`);
      const data = await response.json();
      setUser(data);
    };
    getUser();
  }, [userId]);

  return (
    <div>
      <h1>{user.name}</h1>
      <div>
        <h2>Current Books</h2>

        {user.current.map((book) => (
          <div key={book.id}>
            <a href={`/book/${book.title}`}>{book.title}</a>
          </div>
        ))}
      </div>
      <div>
        {user.history.length > 0 && (
          <>
            <h2>Past Rentals</h2>

            {user.history.map((book) => (
              <div key={book.id}>
                <a href={`/book/${book.title}`}>{book.title}</a>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default User;
