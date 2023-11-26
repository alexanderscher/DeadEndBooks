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

  if (sessionId) {
    const url = isProduction();
    const res = await fetch(`${url}/api/saved/${sessionId}`, {
      next: { revalidate: 60 * 60 * 24, tags: [`saved-${sessionId}`] },
    });
    data = await res.json();
    console.log(data);
  }

  return (
    <main className={"page"}>
      <>
        <Navbar />
        <div className={"w-full"}>
          <Saved res={data} session={serverSession} />
        </div>
      </>
    </main>
  );
};

export default page;
