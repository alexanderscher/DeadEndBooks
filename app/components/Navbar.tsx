"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOutButton } from "../auth";

interface Props {
  isSmallDevice: boolean;
}

const Navbar = ({ isSmallDevice }: Props) => {
  const currentPage = usePathname();
  const [sort, setSort] = useState(false);
  const [menu, setMenu] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      {isSmallDevice ? (
        <div className="flex-col page-margin-small ">
          <div
            className={`w-full flex justify-between  ${
              currentPage === "/" ? "items-center" : "items-end"
            }`}
          >
            <h1 className="font-bold text-[50px]">
              <Link href="/">DEAD END BOOKS</Link>
            </h1>

            {currentPage === "/" || currentPage.includes("/home") ? (
              <div className="mt-2">
                <h1
                  className="text-xl cursor-pointer text-end hover:line-through"
                  onClick={() => {
                    setMenu(!menu), setSort(false);
                  }}
                >
                  Menu
                </h1>

                <h1
                  className="text-xl cursor-pointer text-end hover:line-through"
                  onClick={() => {
                    setSort(!sort), setMenu(false);
                  }}
                >
                  Sort
                </h1>
              </div>
            ) : (
              <h1
                className="text-[26px] cursor-pointer text-end mb-2 hover:line-through"
                onClick={() => setMenu(!menu)}
              >
                Menu
              </h1>
            )}
          </div>
          {menu && (
            <div className="flex mt-4 flex-col">
              <div>
                <button className="hover:line-through text-lg mr-2">
                  <Link href="/">Library,</Link>
                </button>
                <button className="hover:line-through text-lg mr-2">
                  <Link href="/profile">Profile,</Link>
                </button>

                <button className="hover:line-through text-lg ">
                  <Link href="/cart">Cart/</Link>
                </button>
                <button className="hover:line-through text-lg">
                  <Link href="/saved">Saved/</Link>
                </button>
                <button className="hover:line-through text-lg mr-2">
                  <Link href="/cue">Cue,</Link>
                </button>

                <button className="hover:line-through text-lg mr-2">
                  <Link href="/saved">Other's reads, </Link>
                </button>
              </div>
              <div>
                <button className="hover:line-through text-lg mr-2">
                  <Link href="/subscribe">Subscribe,</Link>
                </button>
                <button className="hover:line-through text-lg mr-2">
                  <Link href="/about">About,</Link>
                </button>

                {session ? (
                  <LogOutButton />
                ) : (
                  <>
                    {" "}
                    <button className="hover:line-through text-lg mr-2">
                      <Link href="/">Sign up,</Link>
                    </button>
                    <button className="hover:line-through text-lg mr-2">
                      <Link href="/subscribe">Login,</Link>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          {sort && (
            <div className="flex flex-wrap mt-4">
              <button className="hover:line-through text-lg mr-2">
                <Link href={`/`}>All,</Link>
              </button>
              <button className="hover:line-through text-lg mr-2">
                <Link href={`/home/painting`}>Painting,</Link>
              </button>
              <button className="hover:line-through text-lg mr-2">
                <Link href={`/home/sculpture`}>Scultpure,</Link>
              </button>
              <button className="hover:line-through text-lg mr-2">
                <Link href={`/home/photography_film`}>Photography/film,</Link>
              </button>
              <button className="hover:line-through text-lg mr-2">
                <Link href={`/home/catalogs_magazines`}>
                  Catalogs and Magazines,
                </Link>
              </button>
              <button className="hover:line-through text-lg mr-2">
                <Link href={`/home/anthologies_miscellaneous`}>
                  Anthologies/miscellaneous
                </Link>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-1/4 min-w-[200px] max-w-[200px]  page-margin">
          <div className="fixed">
            <div className="">
              <div className="">
                <h1 className="font-bold text-lg">
                  <Link href="/">DEAD END BOOKS</Link>
                </h1>
              </div>
              <div className="mt-5 flex flex-col items-start">
                <button className={`hover:line-through text-lg`}>
                  <Link href="/">Library</Link>
                </button>
              </div>
              <div className="">
                {currentPage === "/" || currentPage.includes("/home") ? (
                  <div className="flex flex-col items-start">
                    <button
                      className="hover:line-through text-lg flex items-center"
                      onClick={() => {
                        setSort(!sort);
                      }}
                    >
                      Sort by medium:
                    </button>
                    {sort && (
                      <div className="flex flex-col items-start text-md">
                        <button className="hover:line-through ">
                          <Link href={`/`}>All</Link>
                        </button>
                        <button className="hover:line-through">
                          <Link href={`/home/painting`}>Painting</Link>
                        </button>

                        <button className="hover:line-through ">
                          <Link href={`/home/sculpture`}>Scultpure</Link>
                        </button>
                        <button className="hover:line-through ">
                          <Link href={`/home/photography_film`}>
                            Photography/film
                          </Link>
                        </button>
                        <button className="hover:line-through ">
                          <Link href={`/home/catalogs_magazines`}>
                            Catalogs and Magazines
                          </Link>
                        </button>
                        <button className="hover:line-through ">
                          <Link href={`/home/anthologies_miscellaneous`}>
                            Anthologies/miscellaneous
                          </Link>
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="mt-5 flex flex-col items-start">
                <button className="hover:line-through text-lg">
                  <Link href="/profile">Profile</Link>
                </button>

                <div className="flex items-start">
                  <button className="hover:line-through text-lg">
                    <Link href="/cart">Cart/</Link>
                  </button>
                  <button className="hover:line-through text-lg">
                    <Link href="/saved">Saved/</Link>
                  </button>
                  <button className="hover:line-through text-lg">
                    <Link href="/cue">Cue</Link>
                  </button>
                </div>
                <button className="hover:line-through text-lg mr-2">
                  <Link href="/saved">Other's reads</Link>
                </button>
              </div>

              <div className="mt-5 flex flex-col items-start text-lg">
                <a
                  className="hover:line-through"
                  href="mailto:deadendbooks@gmail.com"
                >
                  Email
                </a>

                <button className="hover:line-through text-lg">
                  <a
                    target="_blank"
                    href="https://www.instagram.com/deadendbooks_/"
                  >
                    Instagram
                  </a>
                </button>
                <button className="hover:line-through text-lg mr-2">
                  <Link href="/admin/addbook">Admin</Link>
                </button>
              </div>
              <div className="mt-5 flex flex-col items-start text-lg">
                <button className="hover:line-through text-lg">
                  <Link href="/subscribe">Subscribe</Link>
                </button>
                <button className="hover:line-through text-lg">
                  <Link href="/about">About</Link>
                </button>

                {session ? (
                  <LogOutButton />
                ) : (
                  <>
                    {" "}
                    <button className="hover:line-through text-lg mr-2">
                      <Link href="/signup">Sign up</Link>
                    </button>
                    <button className="hover:line-through text-lg mr-2">
                      <Link href="/login">Log in</Link>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
