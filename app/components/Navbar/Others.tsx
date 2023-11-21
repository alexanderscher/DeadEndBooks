"use client";
import { ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { Navbar } from "..";

type Book = {
  author: string;
  title: string;
  id: number;
  inStock: boolean;
  photo_front: string;
  photo_back: string;
  start_date: string;
};

type User = {
  current_books: Book[];
  past_books: Book[];
  id: number;
  name: string;
  email: string;
};

const Others = () => {
  const { data: session, status } = useSession();
  const sessionId = (session as ExtendedSession)?.user?.id;

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

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetch("/api/user/other", {
        method: "PUT",
        next: { revalidate: 60 * 60 * 24 },
      });
      const data: User[] = await res.json();

      const filteredData = data.filter(
        (user) =>
          (user.current_books.length > 0 || user.past_books.length > 0) &&
          user.id !== parseInt(sessionId)
      );

      filteredData.sort((a: User, b: User) => {
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
      <Navbar />;
      setUsers(filteredData);
    };

    const getMostRecentDate = (books: Book[]): number => {
      if (!books.length) return 0;

      return books.reduce((latest: number, book: Book) => {
        return Math.max(latest, new Date(book.start_date).getTime());
      }, 0);
    };

    getUsers();
  }, [sessionId]);

  if (users.length === 0) {
    return (
      <div className="text-[26px]">
        <h1>There are no current users</h1>
      </div>
    );
  }

  return (
    <div>
      {users.map((user) => (
        <div key={user.id} className="mb-10 border-t-[2px] border-black">
          <h1 className="text-[24px] mt-2 hover:line-through">
            <Link href={`/user/${user.id}`}>{user.name}</Link>
          </h1>
          {user.current_books.length === 0 ? (
            <>
              <p className="text-slate-500 text-[18px]">Recent rentals</p>
              <div className="flex flex-wrap mt-6">
                {user.past_books.map((book) => (
                  <div key={book.id} className="">
                    <div className="max-w-[200px] mr-6">
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
              <p className="text-slate-500 text-[18px]">Current rentals</p>

              <div className="flex mt-6">
                {user.current_books.map((book) => (
                  <div key={book.id} className="">
                    <div className="max-w-[200px] mr-6">
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
