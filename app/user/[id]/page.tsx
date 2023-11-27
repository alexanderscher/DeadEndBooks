import { Loader, Navbar, User } from "@/app/components";
import { isProduction } from "@/utils/name";

const page = async ({ params }: { params: { id: number } }) => {
  let data = null;
  const id = params.id;
  const url = isProduction();
  const response = await fetch(`${url}/api/user/other-users/${id}`);
  data = await response.json();

  return (
    <main className={"page"}>
      <>
        <Navbar />
        <div className={"w-full"}>
          <User res={data} />
        </div>
      </>
    </main>
  );
};

export default page;
