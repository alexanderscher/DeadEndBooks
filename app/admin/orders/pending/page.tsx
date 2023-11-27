"use server";
import { AdminNav, Navbar, Order } from "@/app/components";
import { ExtendedSession } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { isProduction } from "@/utils/name";

const page = async () => {
  // const serverSession = await getServerSession(authOptions);
  // const admin = (serverSession as ExtendedSession)?.user?.admin;

  return (
    <main className={"page"}>
      <>
        <Navbar />

        <div className={"w-full"}>
          <AdminNav />
          <Order />
        </div>
      </>
    </main>
  );
};

export default page;
