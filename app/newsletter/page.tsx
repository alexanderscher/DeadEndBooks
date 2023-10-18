"use client";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Loader, Navbar } from "@/app/components";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types";

const Newsletter = () => {
  const { data: session } = useSession();
  const [newsletter, setNewsletter] = useState(true);
  const [reload, setReload] = useState(false);

  const cancel = async () => {
    const response = await fetch(`/api/user/newsletter`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newsletter: false,
        userId: (session as ExtendedSession)?.user?.id,
      }),
    });
    setReload(true);
  };

  const signup = async () => {
    const response = await fetch(`/api/user/newsletter`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newsletter: true,
        userId: (session as ExtendedSession)?.user?.id,
      }),
    });
    setReload(true);
  };

  useEffect(() => {
    setReload(false);
    const getUser = async () => {
      console.log((session as ExtendedSession)?.user?.id);

      const res = await fetch(
        `/api/user/${(session as ExtendedSession)?.user?.id}`
      );
      const data = await res.json();
      setNewsletter(data.newsletter);
      console.log(data);
    };
    getUser();
  }, [session, reload]);

  return (
    <div>
      {newsletter ? (
        <div className="flex">
          <div>
            <h1 className="text-[26px]">You are signed up for newsletters</h1>
            <button
              className="text-red-500 text-[26px] hover:line-through"
              onClick={cancel}
            >
              Cancel newsletter
            </button>
          </div>
        </div>
      ) : (
        <button
          className="text-red-500 text-[26px] hover:line-through"
          onClick={signup}
        >
          Sign up for newsletters
        </button>
      )}
    </div>
  );
};

const page = () => {
  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });
  const { data: session, status } = useSession();

  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    if (session) {
      setisLoading(false);
    }
  }, [session]);

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

          {isLoading && session !== null ? (
            <Loader />
          ) : (
            <div
              className={
                isSmallDevice ? "page-margin-small" : "page-margin w-full"
              }
            >
              <Newsletter />
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default page;
