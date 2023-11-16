"use client";
import { Book } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

type Obj = {
  name: string;
  current: Array<Book>;
  history: Array<Book>;
};

type Props = {
  isSmallDevice: boolean;
};

const User = ({ isSmallDevice }: Props) => {
  const currentPage = usePathname();
  const userId = currentPage.split("/")[2];

  const [user, setUser] = useState<Obj>({
    name: "",
    current: [],
    history: [],
  });
  console.log(user);
  const [isError, setIsError] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/other-users/${userId}`);
      const data = await response.json();
      if (response.status === 404) {
        setIsError(true);
      }
      setUser(data);
    };
    getUser();
  }, [userId]);

  if (isError) {
    return (
      <div>
        <p className="text-[40px]">User not found</p>

        <button className="text-red-500 text-[40px] hover:line-through">
          <Link href="/home">Home</Link>
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className={isSmallDevice ? "mt-6" : ""}>
        <h1 className="text-[30px] text-red-500">{user.name}</h1>
      </div>

      {user.current.length === 0 && user.history.length === 0 && (
        <div className="mt-6">
          <p className="mt-4 text-slate-500 text-lg">
            This user has not rented any books from us yet.
          </p>
        </div>
      )}
      {user.current.length > 0 && (
        <div className="w-full mt-6">
          <h2 className="text-[26px] border-b-[2px] text-slate-500 border-slate-500">
            Current Books
          </h2>

          <div className="flex flex-wrap justify-between">
            {user.current.map((book) => (
              <div key={book.id} className="w-[32%] mt-4">
                <a href={`/book/${book.title}`}>
                  <img
                    src={book.photo_front}
                    alt={book.title}
                    className=" book-image"
                  />
                </a>
              </div>
            ))}

            {Array(3 - (user.current.length % 3))
              .fill(null)
              .map((_, index) => (
                <div
                  key={"placeholder" + index}
                  className="w-[32%] mt-4 opacity-0"
                ></div>
              ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        {user.history.length > 0 && (
          <>
            <h2 className="text-[26px] border-b-[2px] text-slate-500 border-slate-500">
              Past Rentals
            </h2>
            <div className="flex flex-wrap justify-between">
              {user.history.map((book) => (
                <div key={book.id} className="w-[32%] mt-4">
                  <a href={`/book/${book.title}`}>
                    <img
                      src={book.photo_front}
                      alt={book.title}
                      className="book-image"
                    />
                  </a>
                </div>
              ))}

              {Array(3 - (user.history.length % 3))
                .fill(null)
                .map((_, index) => (
                  <div
                    key={"placeholder" + index}
                    className="w-[32%] mt-4 opacity-0"
                  ></div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default User;
