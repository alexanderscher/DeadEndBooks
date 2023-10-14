"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { Loader } from "..";
import { ExtendedSession } from "@/types";
import { useSession } from "next-auth/react";

interface BookImage {
  photo_front: string;
  id: number;
  title: string;
  medium: string;
}
const splitDataIntoColumns = <T extends BookImage>(
  data: T[],
  columns: number
): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < columns; i++) {
    result.push([]);
  }
  data.forEach((item, index) => {
    result[index % columns].push(item);
  });
  return result;
};

interface Props {
  isSmallDevice: boolean;
  isMediumDevice: boolean;
}

const Books = ({ isSmallDevice, isMediumDevice }: Props) => {
  const currentPage = usePathname();
  const [isLoading, setisLoading] = useState(true);
  const { data: session } = useSession();
  const sessionId = (session as ExtendedSession)?.user?.id;
  console.log(sessionId);

  const [columns, setColumns] = useState(isMediumDevice ? 3 : 2);
  const [columnsData, setColumnsData] = useState<BookImage[][]>([]);
  const [data, setData] = useState<BookImage[]>([]);
  type Page =
    | "/home"
    | "/library/painting"
    | "/library/sculpture"
    | "/library/photography_film"
    | "/library/catalogs_magazines"
    | "/library/anthologies_miscellaneous"
    | "/library/stock";

  const pageToMediumMap: Record<Page, string | null> = {
    "/home": null,
    "/library/painting": "painting",
    "/library/sculpture": "sculpture",
    "/library/photography_film": "photography_film",
    "/library/catalogs_magazines": "catalogs_magazines",
    "/library/anthologies_miscellaneous": "anthologies_miscellaneous",
    "/library/stock": "stock",
  };

  useEffect(() => {
    const getBooks = async () => {
      setisLoading(true);
      const res = await fetch("/api/book");
      const data = await res.json();
      console.log(data);
      const booktoPush = [];

      for (const d in data) {
        const expectedMedium =
          pageToMediumMap[currentPage as keyof typeof pageToMediumMap];

        if (expectedMedium === "stock") {
          if (data[d].inStock) {
            let stockStatus = "";
            if (
              data[d].Queue[0]?.userId !== parseInt(sessionId) &&
              data[d].inStock &&
              data[d].Queue.length > 0
            ) {
              console.log("notYours");
              stockStatus = "notYours";
            } else if (
              data[d].Queue[0]?.userId === parseInt(sessionId) &&
              data[d].inStock
            ) {
              console.log("yours");
              stockStatus = "yours";
            } else if (data[d].Queue.length === 0 && data[d].inStock) {
              stockStatus = "upForGrabs";
              console.log("upForGrabs");
            }
            if (stockStatus !== "notYours") {
              booktoPush.push({
                photo_front: data[d].photo_front,
                id: data[d].id,
                title: data[d].title,
                medium: data[d].medium,
              });
            } else if (sessionId === undefined) {
              booktoPush.push({
                photo_front: data[d].photo_front,
                id: data[d].id,
                title: data[d].title,
                medium: data[d].medium,
              });
            }
          }
        } else if (
          expectedMedium === null ||
          data[d].medium === expectedMedium
        ) {
          booktoPush.push({
            photo_front: data[d].photo_front,
            id: data[d].id,
            title: data[d].title,
            medium: data[d].medium,
          });
        }
      }
      setData(booktoPush);
    };
    getBooks();
  }, [sessionId]);

  useEffect(() => {
    if (data.length > 0) {
      const newColumns = isMediumDevice ? 2 : 3;
      if (newColumns !== columns) {
        setColumns(newColumns);
        setColumnsData(splitDataIntoColumns(data, newColumns));
      }
      setisLoading(false);
    }
  }, [isMediumDevice, columns, data]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {!isSmallDevice ? (
        <div className="flex page-margin w-full">
          {columnsData.map((column, columnIndex) => (
            <div key={columnIndex} className={`flex flex-col w-full`}>
              {column.map((item, index) => (
                <div key={index} className="relative ml-6 ">
                  <Link href={`/book/${item.title}`}>
                    <img
                      className={"mb-6 w-full book-image"}
                      src={item.photo_front}
                    />
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col page-margin-small">
          <div className="flex justify-center">
            {columnsData.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className={`mt-4 flex flex-col w-full ${
                  columnIndex > 0 ? "ml-4" : ""
                }`}
              >
                {column.map((item, index) => (
                  <div key={index} className="relative">
                    <Link href={`/book/${item.title}`}>
                      <img
                        className={"mb-6 w-full book-image"}
                        src={item.photo_front}
                      />
                    </Link>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Books;
