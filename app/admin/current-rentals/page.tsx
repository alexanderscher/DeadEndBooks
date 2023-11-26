"use server";
import { AdminNav, CurrentRentals, Navbar } from "@/app/components";
import { ExtendedSession } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { isProduction } from "@/utils/name";

const page = async () => {
  const serverSession = await getServerSession(authOptions);
  const admin = (serverSession as ExtendedSession)?.user?.admin;

  // let data = null;

  // if (admin) {
  //   const url = isProduction();
  //   const res = await fetch(`${url}/api/admin/rentals/current-rentals`, {
  //     cache: "no-cache",
  //   });
  //   data = await res.json();
  // }

  return (
    <main className={"page"}>
      <>
        <Navbar />

        <div className={" w-full"}>
          <AdminNav />
          <CurrentRentals />
        </div>
      </>
    </main>
  );
};

export default page;
