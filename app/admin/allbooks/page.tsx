import { AdminNav, Navbar } from "@/app/components";
import AllBooks from "@/app/components/Admin/AllBooks";
import { isProduction } from "@/utils/name";

const page = async () => {
  let data = null;

  const url = isProduction();
  const res = await fetch(`${url}/api/book`, {
    cache: "no-cache",
    method: "PUT",
    next: { tags: ["all-books"], revalidate: 0 },
  });
  data = await res.json();

  return (
    <main className="page">
      <>
        <Navbar />

        <div className={" w-full"}>
          <AdminNav />
          <AllBooks res={data} />
        </div>
      </>
    </main>
  );
};

export default page;
