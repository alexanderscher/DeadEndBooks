"use server";
import { AdminNav, Navbar, Order } from "@/app/components";
import { ExtendedSession } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isProduction } from "@/utils/name";

const page = async () => {
  const serverSession = await getServerSession(authOptions);
  const admin = (serverSession as ExtendedSession)?.user?.admin;

  let data = null;

  const url = isProduction();
  const res = await fetch(`${url}/api/order/completed`, {
    cache: "no-cache",
  });
  data = await res.json();

  return (
    <main className={"page"}>
      <>
        <Navbar />

        <div className={"w-full"}>
          <AdminNav />
          <Order res={data} />
        </div>
      </>
    </main>
  );
};

export default page;
