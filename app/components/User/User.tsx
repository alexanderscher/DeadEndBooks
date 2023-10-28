"use client";
import { Book } from "@/types";
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
      <div className={isSmallDevice ? "mt-6" : ""}>
        <h1 className="text-[30px] text-red-500">{user.name}</h1>
      </div>

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
