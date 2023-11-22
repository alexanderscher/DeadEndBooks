"use client";
import React, { useEffect, useState } from "react";
import SingleBook from "@/app/components/Book/SingleBook";
import { Navbar } from "@/app/components";
import { isProduction } from "@/utils/name";

const page = async ({ params }: { params: { title: string } }) => {
  const url = isProduction();
  const title = params.title;

  const res = await fetch(`${url}/api/book/${title}`, {
    cache: "no-cache",
  });
  const data = await res.json();
  const status = res.status;

  return (
    <main className="page">
      <>
        <Navbar />
        <SingleBook res={data} status={status} />
      </>
    </main>
  );
};

export default page;
