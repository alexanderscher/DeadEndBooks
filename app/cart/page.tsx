import Navbar from "../components/Navbar/Navbar";
import { Cart } from "../components";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { ExtendedSession } from "@/types";

const page = async () => {
  const session = (await getServerSession(authOptions)) as ExtendedSession;

  return (
    <main className={"page"}>
      <>
        <Navbar />

        <div className={" w-full"}>
          <Cart session={session} />
        </div>
      </>
    </main>
  );
};

export default page;
