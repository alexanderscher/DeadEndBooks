"use server";
import { AdminNav, EditBook, Navbar } from "@/app/components";
import { ExtendedSession } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { isProduction } from "@/utils/name";

const page = async ({ params }: { params: { slug: string } }) => {
  // const serverSession = await getServerSession(authOptions);
  // const admin = (serverSession as ExtendedSession)?.user?.admin;
  const slug = params.slug;

  // const url = isProduction();
  // const res = await fetch(`${url}/api/admin/book/${slug}`);

  // data = await res.json();
  // console.log(res);

  return (
    <main className={"page"}>
      <>
        <Navbar />

        <div className={" w-full"}>
          <AdminNav />
          <EditBook />
        </div>
      </>
    </main>
  );
};

export default page;
