"use client";
import { Book } from "@/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Loader } from "..";
import { useDeviceQueries } from "@/utils/deviceQueries";
import SearchBarAdmin from "@/app/components/Admin/SearchBarAdmin";

type Props = {
  res: any;
};
const AllBooks = () => {
  const { isMobileDevice } = useDeviceQueries();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoaded, setIsLoaded] = useState(true);

  const [filteredData, setFilteredData] = useState([]);

  const toMapOver = filteredData.length > 0 ? filteredData : books;

  const handleFilterUpdate = (newFilteredData: any) => {
    setFilteredData(newFilteredData);
  };

  useEffect(() => {
    const getBooks = async () => {
      setIsLoaded(true);

      const res = await fetch(`/api/book`, {
        cache: "no-cache",
        method: "PUT",
      });
      const data = await res.json();

      setBooks(data);
      setIsLoaded(false);
    };
    getBooks();
  }, []);

  if (isLoaded) {
    return <Loader />;
  }
  return (
    <div>
      <SearchBarAdmin data={books} onFilterUpdate={handleFilterUpdate} />
      {/* {filteredData.length > 0 ? ():()} */}
      {toMapOver.map((book) => (
        <div
          key={book.id}
          className="border-t-[2px] border-slate-300 mt-6 flex w-full"
        >
          <div
            className={
              isMobileDevice
                ? "w-1/2 mt-4 flex flex-col items-start"
                : "w-1/2 mt-2 mr-4"
            }
          >
            <div className="w-full ">
              <p className="text-slate-400 ">Title</p>
              <p className="mb-2 hover:line-through">
                <Link href={`/book/${book.id}`}>{book.title}</Link>
              </p>

              <p className="text-slate-400">Author</p>
              <p className="mb-2">{book.author}</p>

              <p className="text-slate-400">Medium</p>
              <p className="mb-2">{book.medium.replace("_", " ")}</p>

              <p className="text-slate-400">Publisher</p>
              <p className="mb-2">{book.publisher}</p>

              <button className="text-red-500 hover:line-through">
                <Link href={`/admin/editbook/${book.id}`}>Edit</Link>
              </button>
            </div>
          </div>
          {isMobileDevice ? (
            <div className="w-1/2 max-w-[500px] mt-4 flex flex-col items-end">
              <div className="w-3/4 mr-4 mb-2">
                <img src={book.photo_front} alt="" />
              </div>
              <div className="w-3/4 mr-4 mb-2">
                <img src={book.photo_back} alt="" />
              </div>
            </div>
          ) : (
            <div className="w-1/2 max-w-[500px] mt-4 flex ">
              <div className="w-1/2 mr-4">
                <img src={book.photo_front} alt="" />
              </div>
              <div className="w-1/2">
                <img src={book.photo_back} alt="" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllBooks;
