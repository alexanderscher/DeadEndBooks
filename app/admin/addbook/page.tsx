"use server";
import { AddBook, AdminNav, Navbar, Order } from "@/app/components";
import { ExtendedSession } from "@/types";
import { getServerSession } from "next-auth";

import { isProduction } from "@/utils/name";
import { authOptions } from "@/utils/auth";

const page = async () => {
  // const serverSession = await getServerSession(authOptions);
  // const admin = (serverSession as ExtendedSession)?.user?.admin;

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
