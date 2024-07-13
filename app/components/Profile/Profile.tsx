"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Loader } from "..";
import { useDeviceQueries } from "@/utils/deviceQueries";
import { deleteAccount } from "@/app/actions/users/deleteAccount";
import { signOut } from "next-auth/react";

interface Props {
  res: any;
}

const Profile = ({ res }: Props) => {
  const { isSmallDevice } = useDeviceQueries();
  const [areYouSure, setAreYouSure] = useState(false);
  const [isLoading, setisLoading] = useState(true);

  const deleteAccountCall = async () => {
    try {
      await deleteAccount();
      await signOut();
    } catch (e) {
      console.error(e);
    }
  };

  const [user, setUser] = useState({
    id: null,
    admin: false,
    email: "",
    name: "",
    address: {
      id: null,
      address: "",
      zipcode: "",
      city: "",
      state: "",
      country: "",
      phone: "",
    },
  });

  useEffect(() => {
    const getUser = async () => {
      setisLoading(true);

      const data = res;

      setUser(data);
    };
    getUser();
    setisLoading(false);
  }, [res]);

  if (isLoading) {
    return <Loader />;
  }

  if (res === null) {
    return (
      <div className={`${isSmallDevice ? "mt-10" : ""}`}>
        <h1 className="text-[26px]">Log in or sign up to view your profile</h1>
        <div className="mt-10">
          <h1 className="text-red-500  hover:line-through text-[26px]">
            <Link href="/login">Log in</Link>
          </h1>
          <h1 className="text-red-500  hover:line-through text-[26px]">
            <Link href="/signup">Sign up</Link>
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className={isSmallDevice ? "mt-10" : " w-full"}>
      <div className="mt-10  w-full max-w-[800px]">
        <div className="mb-10 flex justify-between">
          <div>
            <span className="text-[16px] text-slate-400">Name</span>
            <h1 className="text-[26px]">{user.name}</h1>
          </div>
        </div>
        <div className="mb-10">
          <span className="text-[16px] text-slate-400">Email</span>
          <h1 className="text-[26px]">{user.email}</h1>
        </div>

        <div className="mt-10">
          <h1 className="text-[26px] text-red-500 hover:line-through cursor-pointer mb- ">
            <Link href="/profile/editprofile"> Edit profile</Link>
          </h1>
          <h1 className="text-[26px] text-red-500 hover:line-through cursor-pointer mb- ">
            <Link href="/newsletter">Manage Newsletter</Link>
          </h1>
          <h1
            className="text-[26px] text-red-500 hover:line-through cursor-pointer mb- "
            onClick={() => {
              setAreYouSure(true);
            }}
          >
            Delete Account
          </h1>
          {areYouSure && (
            <div className="flex justify-center items-center">
              <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center">
                <div className="bg-red-200 text-red-500 m-10 p-8 rounded-md text-[20px] border-[2px] border-red-500 shadow-lg">
                  <p>Are you sure you want to delete your account?</p>
                  <div className="flex justify-between">
                    <button
                      onClick={deleteAccountCall}
                      className="hover:line-through text-md mt-4 text-end"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setAreYouSure(false);
                      }}
                      className="hover:line-through text-md mt-4 text-end"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
