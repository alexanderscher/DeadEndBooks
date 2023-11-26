"use server";
import { isProduction } from "@/utils/name";
import { Books, Navbar } from "../components";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

const page = async () => {
  const url = isProduction();
  const serverSession = await getServerSession(authOptions);
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
