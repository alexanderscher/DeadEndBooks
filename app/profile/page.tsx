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
  const url = isProduction();
  const res = await fetch(`${url}/api/user/${sessionId}`, {
    next: { revalidate: 60 * 60 * 24 },
  });
  const data = await res.json();

  return (
    <main className={"page"}>
      <>
        <Navbar />

        {serverSession ? (
          <div className={" w-full"}>
            <ProfileNav />

            <Profile res={data} />
          </div>
        ) : (
          <div>
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
