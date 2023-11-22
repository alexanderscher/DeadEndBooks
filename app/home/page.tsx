"use server";
import { isProduction } from "@/utils/name";
import { Books, Navbar } from "../components";

const page = async () => {
  const url = isProduction();
  const res = await fetch(`${url}/api/book`, {
    cache: "no-cache",
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
