"use server";
import { authOptions } from "@/utils/auth";
import { EditProfile, History, Navbar, ProfileNav } from "@/app/components";

import { ExtendedSession } from "@/types";
import { isProduction } from "@/utils/name";
import { getServerSession } from "next-auth";
import Link from "next/link";

const page = async () => {
  const serverSession = await getServerSession(authOptions);
  const isActive = (serverSession as ExtendedSession)?.user?.isActive;
  const sessionId = (serverSession as ExtendedSession)?.user?.id;
  const url = isProduction();

  const res = await fetch(`${url}/api/user/${sessionId}`, {
    next: { tags: [`user-profile-${sessionId}`], revalidate: 60 * 60 * 24 },
  });

  const data = await res.json();
  return (
    <main className={"page"}>
      <>
        <Navbar />

        {serverSession ? (
          <div className={" w-full"}>
            <ProfileNav isActive={isActive} />
            <EditProfile res={data} />
          </div>
        ) : (
          <div className={" w-full"}>
            <h1 className="text-[26px]">
              Log in or sign up to view your profile
            </h1>
            <div className="mt-10">
              <h1 className="text-red-500  hover:line-through text-[26px]">
                <Link href="/login">Log in</Link>
              </h1>
              <h1 className="text-red-500  hover:line-through text-[26px]">
                <Link href="/signup">Sign up</Link>
              </h1>
            </div>
          </div>
        )}
      </>
    </main>
  );
};

export default page;
