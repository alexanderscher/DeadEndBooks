"use server";
import { AddBook, AdminNav, Navbar, Order } from "@/app/components";
import { ExtendedSession } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isProduction } from "@/utils/name";

const page = async () => {
  const serverSession = await getServerSession(authOptions);
  const admin = (serverSession as ExtendedSession)?.user?.admin;

  let data = null;

  return (
    <main className={"page"}>
      <>
        <Navbar />

        <div className={"w-full"}>
          <AdminNav />
          <AddBook />
        </div>
      </>
    </main>
  );
};

export default page;
