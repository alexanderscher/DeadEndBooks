"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { useMediaQuery } from "react-responsive";

const useIsSmallDevice = () => {
  const isSmallDevice = useMediaQuery({ maxWidth: 800 });
  return isSmallDevice;
};

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
            className={`flex w-full ${
              isSmallDevice ? "page-margin-small" : "page-margin"
            }`}
          >
            <div className={`flex w-full ${isSmallDevice && "mt-10"}`}>
              <div className="w-1/2 flex flex-col ">
                <img
                  className={`mb-6 ${
                    isSmallDevice ? "w-[85%]" : "w-[80%]"
                  } min-w-[200px]`}
                  src={"/41D44xk6A1L._SL1000_.jpg"}
                />
                <img
                  className={`mb-6 ${
                    isSmallDevice ? "w-[85%]" : "w-[80%]"
                  } min-w-[200px]`}
                  src={"/41D44xk6A1L._SL1000_.jpg"}
                />
              </div>
              <div className="w-1/2 text-box">
                <h1 className={isSmallDevice ? "text-[26px]" : "book-text"}>
                  What She Means
                </h1>
                <h1 className={isSmallDevice ? "text-[26px]" : "book-text"}>
                  Joan Didion
                </h1>
                <h1 className={isSmallDevice ? "text-[26px]" : "book-text"}>
                  Publishing, 2022
                </h1>
                <h1
                  className={
                    isSmallDevice
                      ? "text-[26px] text-slate-400"
                      : "book-text text-slate-400"
                  }
                >
                  In stock
                </h1>
                <h1
                  className={`${
                    isSmallDevice ? "text-[26px]" : "book-text"
                  }  cursor-pointer hover:line-through text-red-500`}
                >
                  Save
                </h1>
                <h1
                  className={`${
                    isSmallDevice ? "text-[26px]" : "book-text"
                  }  cursor-pointer hover:line-through text-red-500`}
                >
                  Add to cart
                </h1>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default page;
