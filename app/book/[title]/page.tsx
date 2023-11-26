"use client";
import React, { useEffect, useState } from "react";
import SingleBook from "@/app/components/Book/SingleBook";
import { Navbar } from "@/app/components";
import { isProduction } from "@/utils/name";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

const page = async ({ params }: { params: { title: string } }) => {
  const serverSession = await getServerSession(authOptions);
  const title = params.title;
  return (
    <main className="page">
      <>
        <Navbar />
        <SingleBook title={title} session={serverSession} />
      </>
    </main>
  );
};

export default page;
