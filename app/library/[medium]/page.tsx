"use server";
import { Books, Navbar } from "@/app/components";
import { isProduction } from "@/utils/name";

const page = async () => {
  const url = isProduction();
  const res = await fetch(`${url}/api/book`, {
    next: { tags: ["all-books"], revalidate: 60 * 60 * 24 },
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
