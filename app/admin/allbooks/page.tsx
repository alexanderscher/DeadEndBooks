import { AdminNav, Navbar } from "@/app/components";
import AllBooks from "@/app/components/Admin/AllBooks";
import { isProduction } from "@/utils/name";

const page = async () => {
  return (
    <main className="page">
      <>
        <Navbar />

        <div className={" w-full"}>
          <AdminNav />
          <AllBooks />
        </div>
      </>
    </main>
  );
};

export default page;
