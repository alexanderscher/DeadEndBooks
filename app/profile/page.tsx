"use server";
import Navbar from "../components/Navbar/Navbar";
import Profile from "../components/Profile/Profile";
import { ProfileNav } from "../components";
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
    const res = await fetch(`${url}/api/user/${sessionId}`, {
      cache: "no-cache",
    });
    data = await res.json();
  } else {
    data = null;
  }

  return (
    <main className={"page"}>
      <>
        <Navbar />
        <div className={" w-full"}>
          {data !== null && <ProfileNav />}

          <Profile res={data} />
        </div>
      </>
    </main>
  );
};

export default page;
