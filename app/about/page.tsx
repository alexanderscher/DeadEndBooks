"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Loader from "../components/Loader";
import { useMediaQuery } from "react-responsive";

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 800 });

  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
  }, [isSmallDeviceQuery]);

  return (
    <main className={isSmallDevice ? "page-small" : "page"}>
      {isSmallDevice === null ? (
        <Loader />
      ) : (
        <>
          <Navbar isSmallDevice={isSmallDevice} />
          <div
            className={
              isSmallDevice ? "page-margin-small" : "info w-full page-margin"
            }
          >
            <p className={isSmallDevice ? "text-[25px] mt-10" : "text-end"}>
              Dead End Books is a subscription-based art book library. The
              barrier to entry for art books is uniquely expensive and
              exclusive, requiring either great resources or prior education and
              affiliation with the arts. Through a low-cost, monthly membership,
              you gain access to a large collection of art books. The majority
              of university libraries or special collections are site-specific,
              have a complicated application process, and don’t allow you to
              remove the books from the premises. We believe the books
              themselves are art objects and should be experienced in hand. With
              Dead End Books you can sit in bed and mimic artists’ sketches or
              pace around the living room understanding an artist's process. We
              want you to engage with these materials on your own terms and in
              your own environments.
            </p>

            <div
              className={`mt-10 flex flex-col ${
                isSmallDevice ? "items-start" : "items-end"
              }`}
            >
              {/* <span>Email</span> */}
              <button
                className={`hover:line-through ${
                  isSmallDevice && "text-[25px]"
                } text-red-500`}
              >
                <a target="_blank" href="mailto:deadendbooks@gmail.com">
                  deadendbooks@gmail.com
                </a>
              </button>
              {/* <span>Instagram</span> */}
              <button
                className={`hover:line-through ${
                  isSmallDevice && "text-[25px]"
                } text-red-500`}
              >
                <a
                  target="_blank"
                  href="https://www.instagram.com/deadendbooks_/"
                >
                  @deadendbooks_
                </a>
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default page;
