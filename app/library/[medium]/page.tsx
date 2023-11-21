"use server";

import { Books, Navbar } from "@/app/components";

const page = async () => {
  const res = await fetch("http://localhost:3000/api/book", {
    next: { revalidate: 60 * 60 * 24 },
  });
  const data = await res.json();
  console.log(data);
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
