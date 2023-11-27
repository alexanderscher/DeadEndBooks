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

  return (
    <main className={"page"}>
      <>
        <Navbar />

        <div className={" w-full"}>
          <Cart session={serverSession} />
        </div>
      </>
    </main>
  );
};

export default page;
