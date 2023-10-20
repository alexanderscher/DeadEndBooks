"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use, useEffect, useState } from "react";
import { LogOutButton } from "../../auth";
import { ExtendedSession } from "@/types";

interface Props {
  isSmallDevice: boolean;
  isMobileDevice: boolean;
}

const Navbar = ({ isSmallDevice, isMobileDevice }: Props) => {
  const currentPage = usePathname();
  const [sort, setSort] = useState(false);
  const [menu, setMenu] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      {isSmallDevice ? (
        <div className="flex-col bg-white">
          <div
            className={`w-full flex justify-between  ${
              currentPage === "/home" ? "items-center" : "items-end"
            }`}
          >
            <h1
              className={`font-bold ${
                isMobileDevice ? "text-[32px]" : "text-[40px]"
              }`}
            >
              <Link href="/home">DEAD END BOOKS</Link>
            </h1>

            {currentPage === "/home" || currentPage.includes("/library") ? (
              <div className="mt-2">
                <h1
                  className={`${
                    isMobileDevice ? "text-[14px]" : "text-xl"
                  } cursor-pointer text-end hover:line-through`}
                  onClick={() => {
                    setMenu(!menu), setSort(false);
                  }}
                >
                  Menu
                </h1>

                <h1
                  className={`${
                    isMobileDevice ? "text-[14px]" : "text-xl"
                  } cursor-pointer text-end hover:line-through`}
                  onClick={() => {
                    setSort(!sort), setMenu(false);
                  }}
                >
                  Sort
                </h1>
              </div>
            ) : (
              <h1
                className={`${
                  isMobileDevice ? "text-[16px]" : "text-xl"
                } mb-2 cursor-pointer text-end hover:line-through`}
                onClick={() => setMenu(!menu)}
              >
                Menu
              </h1>
            )}
          </div>
          {menu && (
            <div
              className={`flex mt-4 flex-col ${
                isMobileDevice ? "mt-2" : "mt-4"
              }`}
            >
              <div>
                <button
                  className={`hover:line-through ${
                    isMobileDevice ? "text-sm" : "text-md"
                  } mr-2`}
                >
                  <Link href="/home">Library,</Link>
                </button>
                <button
                  className={`hover:line-through ${
                    isMobileDevice ? "text-sm" : "text-md"
                  } mr-2`}
                >
                  <Link href="/profile">Profile,</Link>
                </button>

                <button
                  className={`hover:line-through ${
                    isMobileDevice ? "text-sm" : "text-md"
                  }`}
                >
                  <Link href="/cart">Cart/</Link>
                </button>
                <button
                  className={`hover:line-through ${
                    isMobileDevice ? "text-sm" : "text-md"
                  }`}
                >
                  <Link href="/saved">Saved/</Link>
                </button>
                <button
                  className={`hover:line-through ${
                    isMobileDevice ? "text-sm" : "text-md"
                  } mr-2`}
                >
                  <Link href="/queue">Queue,</Link>
                </button>

                <button
                  className={`hover:line-through ${
                    isMobileDevice ? "text-sm" : "text-md"
                  } mr-2`}
                >
                  <Link href="/others">Other's reads, </Link>
                </button>

                <button
                  className={`hover:line-through ${
                    isMobileDevice ? "text-sm" : "text-md"
                  } mr-2`}
                >
                  <Link href="/subscribe">Subscribe,</Link>
                </button>
                <button
                  className={`hover:line-through ${
                    isMobileDevice ? "text-sm" : "text-md"
                  } mr-2`}
                >
                  <Link href="/about">About,</Link>
                </button>
                {session && (session as ExtendedSession)?.user?.admin && (
                  <button
                    className={`hover:line-through ${
                      isMobileDevice ? "text-sm" : "text-md"
                    } mr-2`}
                  >
                    <Link href="/admin/addbook">Admin,</Link>
                  </button>
                )}

                {session ? (
                  <LogOutButton isSmallDevice={isSmallDevice} />
                ) : (
                  <>
                    <button
                      className={`hover:line-through ${
                        isMobileDevice ? "text-sm" : "text-md"
                      } mr-2`}
                    >
                      <Link href="/home">Sign up,</Link>
                    </button>
                    <button
                      className={`hover:line-through ${
                        isMobileDevice ? "text-sm" : "text-md"
                      } mr-2`}
                    >
                      <Link href="/login">Log in</Link>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          {sort && (
            <div className="flex w-full flex-wrap mt-4 0">
              <button
                className={`hover:line-through ${
                  isMobileDevice ? "text-sm" : "text-md"
                } mr-2`}
              >
                <Link href={`/home`}>All,</Link>
              </button>
              <button
                className={`hover:line-through ${
                  isMobileDevice ? "text-sm" : "text-md"
                } mr-2`}
              >
                <Link href={`/library/painting`}>Painting,</Link>
              </button>
              <button
                className={`hover:line-through ${
                  isMobileDevice ? "text-sm" : "text-md"
                } mr-2`}
              >
                <Link href={`/library/sculpture`}>Scultpure,</Link>
              </button>
              <button
                className={`hover:line-through ${
                  isMobileDevice ? "text-sm" : "text-md"
                } mr-2`}
              >
                <Link href={`/library/photography_film`}>
                  Photography/film,
                </Link>
              </button>
              <button
                className={`hover:line-through ${
                  isMobileDevice ? "text-sm" : "text-md"
                } mr-2`}
              >
                <Link href={`/library/catalogs_magazines`}>
                  Catalogs and Magazines,
                </Link>
              </button>
              <button
                className={`hover:line-through ${
                  isMobileDevice ? "text-sm" : "text-md"
                } mr-2`}
              >
                <Link href={`/library/anthologies_miscellaneous`}>
                  Anthologies/miscellaneous,
                </Link>
              </button>
              <button
                className={`hover:line-through ${
                  isMobileDevice ? "text-sm" : "text-md"
                } mr-2`}
              >
                <Link href={`/library/stock`}>In stock</Link>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-1/4 min-w-[200px] max-w-[200px]   ">
          <div className="fixed bg-white">
            <div className="">
              <div className="">
                <h1 className="font-bold text-md">
                  <Link href="/home">DEAD END BOOKS</Link>
                </h1>
              </div>
              <div className="mt-5 flex flex-col items-start">
                <button className={`hover:line-through text-md`}>
                  <Link href="/home">Library</Link>
                </button>
              </div>
              <div className="">
                {currentPage === "/home" || currentPage.includes("/library") ? (
                  <div className="flex flex-col items-start">
                    <button
                      className="hover:line-through text-md flex items-center"
                      onClick={() => {
                        setSort(!sort);
                      }}
                    >
                      Sort:
                    </button>
                    {sort && (
                      <div className="flex flex-col items-start text-md text-red-500">
                        <button className="hover:line-through ">
                          <Link href={`/home`}>All</Link>
                        </button>
                        <button className="hover:line-through">
                          <Link href={`/library/painting`}>Painting</Link>
                        </button>

                        <button className="hover:line-through ">
                          <Link href={`/library/sculpture`}>Scultpure</Link>
                        </button>
                        <button className="hover:line-through ">
                          <Link href={`/library/photography_film`}>
                            Photography/film
                          </Link>
                        </button>
                        <button className="hover:line-through ">
                          <Link href={`/library/catalogs_magazines`}>
                            Catalogs and Magazines
                          </Link>
                        </button>
                        <button className="hover:line-through ">
                          <Link href={`/library/anthologies_miscellaneous`}>
                            Anthologies/miscellaneous
                          </Link>
                        </button>
                        <button className="hover:line-through ">
                          <Link href={`/library/stock`}>In stock</Link>
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="mt-5 flex flex-col items-start">
                <button className="hover:line-through text-md">
                  <Link href="/profile">Profile</Link>
                </button>

                <div className="flex items-start">
                  <button className="hover:line-through text-md">
                    <Link href="/cart">Cart/</Link>
                  </button>
                  <button className="hover:line-through text-md">
                    <Link href="/saved">Saved/</Link>
                  </button>
                  <button className="hover:line-through text-md">
                    <Link href="/queue">Queue</Link>
                  </button>
                </div>
                <button
                  className={`hover:line-through ${
                    isMobileDevice ? "text-sm" : "text-md"
                  } mr-2`}
                >
                  <Link href="/others">Other's reads</Link>
                </button>
              </div>

              <div className="mt-5 flex flex-col items-start text-md">
                <button className="hover:line-through text-md">
                  <Link href="/subscribe">Subscribe</Link>
                </button>

                <button className="hover:line-through text-md">
                  <Link href="/about">About</Link>
                </button>
                {session && (session as ExtendedSession)?.user?.admin && (
                  <button className="hover:line-through text-md">
                    <Link href="/admin/addbook">Admin</Link>
                  </button>
                )}
              </div>
              <div className="mt-5 flex flex-col items-start text-md">
                <a
                  className="hover:line-through"
                  href="mailto:deadendbooks@gmail.com"
                >
                  Email
                </a>

                <button className="hover:line-through text-md">
                  <a
                    target="_blank"
                    href="https://www.instagram.com/deadendbooks_/"
                  >
                    Instagram
                  </a>
                </button>

                {session ? (
                  <LogOutButton isSmallDevice={isSmallDevice} />
                ) : (
                  <>
                    <button
                      className={`hover:line-through ${
                        isMobileDevice ? "text-sm" : "text-md"
                      } mr-2`}
                    >
                      <Link href="/signup">Sign up</Link>
                    </button>
                    <button
                      className={`hover:line-through ${
                        isMobileDevice ? "text-sm" : "text-md"
                      } mr-2`}
                    >
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
