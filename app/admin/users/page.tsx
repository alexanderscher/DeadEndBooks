"use server";
import { AdminNav, Navbar, Users } from "@/app/components";
import { ExtendedSession } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { isProduction } from "@/utils/name";

const page = async () => {
  const serverSession = await getServerSession(authOptions);
  const admin = (serverSession as ExtendedSession)?.user?.admin;

  let data = null;

  const url = isProduction();
  const res = await fetch(`${url}/api/user`, {
    next: { tags: ["users"], revalidate: 3600 },
  });
  data = await res.json();

  return (
    <main className={"page"}>
      <>
        <Navbar />
        <div className={" w-full"}>
          <AdminNav />
          <Users res={data} />
        </div>
      </>
    </main>
  );
};

export default page;
