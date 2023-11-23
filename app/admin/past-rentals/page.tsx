"use server";
import { AdminNav, Navbar, PastRentals } from "@/app/components";
import { ExtendedSession } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const page = async () => {
  const serverSession = await getServerSession(authOptions);
  const admin = (serverSession as ExtendedSession)?.user?.admin;

  return (
    <main className={"page"}>
      <>
        <Navbar />

        <div className={" w-full"}>
          <AdminNav />
          <PastRentals />
        </div>
      </>
    </main>
  );
};

export default page;
