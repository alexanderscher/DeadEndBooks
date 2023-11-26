"use client";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Loader, Navbar, User } from "@/app/components";
import { useSession } from "next-auth/react";

const page = async ({ params }: { params: { id: number } }) => {
  let data = null;
  const id = params.id;
  const response = await fetch(`/api/user/other-users/${id}`);
  data = await response.json();

  return (
    <main className={"page"}>
      <>
        <Navbar />

        <div className={"w-full"}>
          <User res={data} />
        </div>
      </>
    </main>
  );
};

export default page;
