"use client";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";

type Book = {
  author: string;
  title: string;
  id: number;
  inStock: boolean;
  photo_front: string;
  photo_back: string;
  start_date: string; // assuming it's a string; adjust if necessary
};

type User = {
  current_books: Book[];
  past_books: Book[];
  id: number;
  name: string;
  email: string;
};

const Others = () => {
  const [users, setUsers] = useState([
    {
      current_books: [
        {
          author: "",
          title: "",
          id: 0,
          inStock: false,
          photo_front: "",
          photo_back: "",
        },
      ],
      past_books: [
        {
          author: "",
          title: "",
          id: 0,
          inStock: false,
          photo_front: "",
          photo_back: "",
        },
      ],
      id: 0,
      name: "",
      email: "",
    },
  ]);
  console.log(users);

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetch("/api/user/other");
      const data: User[] = await res.json();

      data.sort((a: User, b: User) => {
        const aRecentDate =
          a.current_books.length > 0
            ? getMostRecentDate(a.current_books)
            : getMostRecentDate(a.past_books);

        const bRecentDate =
          b.current_books.length > 0
            ? getMostRecentDate(b.current_books)
            : getMostRecentDate(b.past_books);

        return bRecentDate - aRecentDate;
      });

      setUsers(data);
    };

    const getMostRecentDate = (books: Book[]): number => {
      if (!books.length) return 0;

      return books.reduce((latest: number, book: Book) => {
        return Math.max(latest, new Date(book.start_date).getTime());
      }, 0);
    };

    getUsers();
  }, []);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id} className="mb-10 border-t-[2px] border-black">
          <h1 className="text-[30px] mt-2">{user.name}</h1>
          {user.current_books.length === 0 ? (
            <>
              <p className="text-slate-500 text-[20px]">Recent rentals</p>
              <div className="flex flex-wrap mt-6">
                {user.past_books.map((book) => (
                  <div key={book.id} className="">
                    <div className="w-[160px] mr-8">
                      <Link href={`/book/${book.title}`}>
                        <img src={book.photo_front} alt="" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-slate-500 text-[20px]">Current rentals</p>

              <div className="flex flex-wrap mt-6">
                {user.current_books.map((book) => (
                  <div key={book.id} className="">
                    <div className="w-[160px] mr-8">
                      <Link href={`/book/${book.title}`}>
                        <img src={book.photo_front} alt="" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Others;
