"use server";
import Navbar from "../components/Navbar/Navbar";
import { Cart } from "../components";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { ExtendedSession } from "@/types";
import { isProduction } from "@/utils/name";
import { authOptions } from "@/utils/auth";

const page = async () => {
  const serverSession = await getServerSession(authOptions);
  const sessionId = (serverSession as ExtendedSession)?.user?.id;
  let data = null;
  let userData = null;

  if (sessionId) {
    const url = isProduction();
    const res = await fetch(`${url}/api/cart/${sessionId}`, {
      next: { revalidate: 60 * 60 * 24, tags: [`cart-${sessionId}`] },
    });
    data = await res.json();

    const res1 = await fetch(`${url}/api/user/${sessionId}`, {
      next: { tags: [`user-profile-${sessionId}`], revalidate: 60 * 60 * 24 },
    });
    userData = await res1.json();
  }

  return (
    <main className={"page"}>
      <>
        <Navbar />

        <div className={" w-full"}>
          <Cart res={data} userData={userData} session={serverSession} />
        </div>
      </>
    </main>
  );
};

export default page;
