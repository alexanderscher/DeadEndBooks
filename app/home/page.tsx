"use server";
import { isProduction } from "@/utils/name";
import { Books, Navbar } from "../components";

const page = async () => {
  const url = isProduction();
  const res = await fetch(`${url}/api/book`, {
    cache: "no-store",
    next: {
      tags: ["all-books"],
    },
  });
  const data = await res.json();
  return (
    <main className={"page"}>
      <>
        <Navbar />
        <Books res={data} />
      </>
    </main>
  );
};

export default page;
