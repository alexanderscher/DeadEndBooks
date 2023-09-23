"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface Props {
  src: string;
  altText: string;
}

const splitDataIntoColumns = <T extends Props>(
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

const Books = ({}) => {
  const isSmallDevice = useMediaQuery({ maxWidth: 1200 });
  const [columns, setColumns] = useState(isSmallDevice ? 3 : 2);
  const [columnsData, setColumnsData] = useState<Props[][]>([]);

  const data = [
    { src: "/41D44xk6A1L._SL1000_.jpg", altText: "Book 1" },
    { src: "/99c394e46c4ebca64ca3b5b6744ce3fe.jpg", altText: "Book 2" },
    { src: "/0204b06e8f1d4164c0cad08f48a73cdc.jpg", altText: "Book 3" },
    { src: "/9781636810560_cover_FINAL-860x1100.jpg", altText: "Book 4" },
    { src: "/236d4515dce208da9f3deda968c2fe21.jpg", altText: "Book 5" },
    { src: "/a0874dff164b195bcaf227103e44901b.jpg", altText: "Book 6" },
    { src: "/caab230b0d6af333faf46934e7a05889.jpg", altText: "Book 7" },
    { src: "/cf13d83910a510312a6c34b0073a4fc3.jpg", altText: "Book 8" },
    { src: "/9c6ef4aec180782666ae2da0ac6c5428.jpg", altText: "Book 9" },
  ];
  useEffect(() => {
    const newColumns = 2;

    if (newColumns !== columns) {
      setColumns(newColumns);
      setColumnsData(splitDataIntoColumns(data, newColumns));
    }
  }, [isSmallDevice, columns, data]);

  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const getUniqueKey = (colIndex: number, itemIndex: number) =>
    `${colIndex}-${itemIndex}`;

  const handleMouseEnter = (colIndex: number, itemIndex: number) => {
    setHoveredBook(getUniqueKey(colIndex, itemIndex));
  };

  const handleMouseLeave = () => {
    setHoveredBook(null);
  };

  return (
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
              <div
                key={index}
                className="relative"
                onMouseEnter={() => handleMouseEnter(columnIndex, index)}
                onMouseLeave={handleMouseLeave}
              >
                <Link href={"/book"}>
                  <img
                    className="mb-6 w-full book-image"
                    src={item.src}
                    alt={item.altText}
                  />
                </Link>
                {/* {hoveredBook === getUniqueKey(columnIndex, index) && (
                  <div
                    className="absolute bottom-6  bg-white w-full"
                    onMouseOver={() => setIsHovered(true)}
                    onMouseOut={() => setIsHovered(false)}
                  >
                    <div className="p-4">
                      <h1 className="text-red-500 text-[20px] cursor-pointer">
                        Add to cart
                      </h1>
                      <h1 className="text-red-500 text-[20px] cursor-pointer">
                        Save
                      </h1>
                    </div>
                  </div>
                )} */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
