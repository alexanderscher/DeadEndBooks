"use server";
import { AdminNav, Navbar, Order } from "@/app/components";
import { ExtendedSession } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { isProduction } from "@/utils/name";

const page = async () => {
  let data = null;

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
