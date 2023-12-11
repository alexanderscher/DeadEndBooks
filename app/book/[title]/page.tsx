"use client";
import React, { useEffect, useState } from "react";
import SingleBook from "@/app/components/Book/SingleBook";
import { Navbar } from "@/app/components";

// import { authOptions } from "@/utils/auth";
// import { getServerSession } from "next-auth";

const page = async ({ params }: { params: { title: string } }) => {
  // const serverSession = await getServerSession(authOptions);
  const title = params.title;

  return (
    <main className="page">
      <>
        <Navbar />
        <SingleBook title={title} />
      </>
    </main>
  );
};

export default page;
