import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const page = () => {
  // const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  // const isSmallDeviceQuery = useMediaQuery({ maxWidth: 800 });
  // const isMediumDeviceQuery = useMediaQuery({ maxWidth: 1200 });
  // const [isMediumDevice, setIsMediumDevice] = useState<any>(null);

  // useEffect(() => {
  //   setIsSmallDevice(isSmallDeviceQuery);
  //   setIsMediumDevice(isMediumDeviceQuery);
  // }, [isSmallDeviceQuery, isMediumDeviceQuery]);

  // return (
  //   <main className={isSmallDevice ? "page-small" : "page"}>
  //     {isSmallDevice === null ? (
  //       <Loader />
  //     ) : (
  //       <>
  //         <Navbar isSmallDevice={isSmallDevice} />

  //         <Books
  //           isSmallDevice={isSmallDevice}
  //           isMediumDevice={isMediumDevice}
  //         />
  //       </>
  //     )}
  //   </main>
  // );
  return (
    <div className="w-full h-screen flex justify-center ">
      <div className="">
        <Link href="/home">
          <img
            src="/dead-end-stripe.png"
            width={100}
            height={100}
            alt="Logo"
            className="w-full max-w-[500px]"
          ></img>
        </Link>
      </div>
    </div>
  );
};

export default page;
