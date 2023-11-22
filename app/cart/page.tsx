"use server";
import Navbar from "../components/Navbar/Navbar";
import { Cart } from "../components";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { ExtendedSession } from "@/types";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { isProduction } from "@/utils/name";

const page = async () => {
  const serverSession = await getServerSession(authOptions);
  const sessionId = (serverSession as ExtendedSession)?.user?.id;
  let data = null;

  if (sessionId) {
    const url = isProduction();
    const res = await fetch(`${url}/api/cart/${sessionId}`, {
      cache: "no-cache",
    });
    data = await res.json();
  }

  return (
    <main className={"page"}>
      <>
        <Navbar />

        <div className={" w-full"}>
          <Cart res={data} />
        </div>
      </>
    </main>
  );
};

export default page;
