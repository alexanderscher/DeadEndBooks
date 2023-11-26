"use server";
import Navbar from "../components/Navbar/Navbar";
import { Others, ProfileNav } from "../components";
import { getServerSession } from "next-auth";
import { ExtendedSession } from "@/types";
import { isProduction } from "@/utils/name";
import { authOptions } from "@/utils/auth";

const page = async () => {
  const serverSession = await getServerSession(authOptions);
  const sessionId = (serverSession as ExtendedSession)?.user?.id;

  let data = null;

  const url = isProduction();
  const res = await fetch(`${url}/api/user/other`, {
    next: { tags: [`other-users`], revalidate: 60 * 60 * 24 },
  });
  data = await res.json();

  return (
    <main className={"page"}>
      <>
        <Navbar />
        <Others res={data} sessionId={sessionId} />
      </>
    </main>
  );
};

export default page;
