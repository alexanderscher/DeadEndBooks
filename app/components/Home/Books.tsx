"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Loader } from "..";
import { useDeviceQueries } from "@/utils/deviceQueries";

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
  const result: T[][] = new Array(columns).fill(null).map(() => []);

  data.forEach((item, index) => {
    result[index % columns].push(item);
  });

  return result;
};

interface Props {
  res: any;
}

const Books = ({ res }: Props) => {
  const { isSmallDevice, isMediumDevice, isMobileDevice } = useDeviceQueries();

  const currentPage = usePathname();
  const [isLoading, setisLoading] = useState(true);
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

      const data = res;
      const booktoPush = [];

      for (const d in data) {
        const expectedMedium =
          pageToMediumMap[currentPage as keyof typeof pageToMediumMap];

        if (
          (expectedMedium === "stock" && data[d].inStock) ||
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
      setisLoading(false);
    };

    getBooks();
  }, [currentPage, res]);

  useEffect(() => {
    const newColumns = isMediumDevice ? 2 : 3;

    setColumnsData(splitDataIntoColumns(data, newColumns));
  }, [isMediumDevice, data]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={isSmallDevice ? "" : " w-full"}>
      {!isSmallDevice ? (
        <div className="flex w-full">
          {columnsData.map((column, columnIndex) => (
            <div key={columnIndex} className={`flex flex-col w-full`}>
              {column.map((item, index) => (
                <div key={index} className="relative ml-6 ">
                  <Link href={`/book/${item.id}`}>
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
        <div className="flex flex-col ">
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
                    <Link href={`/book/${item.id}`}>
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
    </div>
  );
};

export default Books;
