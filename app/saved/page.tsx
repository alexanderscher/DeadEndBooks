"use server";
import Navbar from "../components/Navbar/Navbar";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { ExtendedSession } from "@/types";
import { isProduction } from "@/utils/name";
import { Saved } from "../components";
import { authOptions } from "@/utils/auth";

const page = async () => {
  const serverSession = await getServerSession(authOptions);
  const sessionId = (serverSession as ExtendedSession)?.user?.id;
  let data = null;

  return (
    <main className={"page"}>
      <>
        <Navbar />
        <div className={"w-full"}>
          <Saved session={serverSession} />
        </div>
      </>
    </main>
  );
};

export default page;
