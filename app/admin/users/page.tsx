"use server";
import { AdminNav, Navbar, Users } from "@/app/components";

const page = async () => {
  return (
    <main className={"page"}>
      <>
        <Navbar />
        <div className={" w-full"}>
          <AdminNav />
          <Users />
        </div>
      </>
    </main>
  );
};

export default page;
