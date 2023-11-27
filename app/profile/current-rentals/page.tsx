"use server";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { ExtendedSession } from "@/types";
import { isProduction } from "@/utils/name";
import { authOptions } from "@/utils/auth";
import { Navbar, ProfileNav, Rentals } from "@/app/components";

const page = async () => {
  const serverSession = await getServerSession(authOptions);
  const isActive = (serverSession as ExtendedSession)?.user?.isActive;
  const sessionId = (serverSession as ExtendedSession)?.user?.id;

  return (
    <main className={"page"}>
      <>
        <Navbar />

        {serverSession ? (
          <div className={" w-full"}>
            <ProfileNav isActive={isActive} />

            <Rentals sessionId={sessionId} />
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
