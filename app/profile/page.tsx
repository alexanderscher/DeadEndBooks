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
  const isActive = (serverSession as ExtendedSession)?.user?.isActive;

  let data = null;

  if (sessionId) {
    const url = isProduction();
    const res = await fetch(`${url}/api/user/${sessionId}`, {
      next: { tags: [`user-profile-${sessionId}`], revalidate: 60 * 60 * 24 },
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
          {data !== null && <ProfileNav isActive={isActive} />}

          <Profile res={data} />
        </div>
      </>
    </main>
  );
};

export default page;
