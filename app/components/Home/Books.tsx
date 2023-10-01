"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { Loader } from "..";

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

  const [columns, setColumns] = useState(isMediumDevice ? 3 : 2);
  const [columnsData, setColumnsData] = useState<BookImage[][]>([]);
  const [data, setData] = useState<BookImage[]>([]);
  type Page =
    | "/"
    | "/home/painting"
    | "/home/sculpture"
    | "/home/photography_film"
    | "/home/catalogs_magazines"
    | "/home/anthologies_miscellaneous";

  const pageToMediumMap: Record<Page, string | null> = {
    "/": null,
    "/home/painting": "painting",
    "/home/sculpture": "sculpture",
    "/home/photography_film": "photography_film",
    "/home/catalogs_magazines": "catalogs_magazines",
    "/home/anthologies_miscellaneous": "anthologies_miscellaneous",
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
        console.log(expectedMedium);

        if (expectedMedium === null || data[d].medium === expectedMedium) {
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
  }, []);

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
        <div className="flex  page-margin">
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
