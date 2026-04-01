"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "../navbar/navbar";
import NavbarSecond from "../navbar/navbar-second";
import NavbarThird from "./navbar-third";

const NavbarMain = () => {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/loginstep" ||
        (pathname === "/loginstep/step3" && <NavbarThird />) ||
        (pathname === "/loginstep/step4" && <NavbarThird />) ||
        (pathname === "/loginstep/step5" && <NavbarThird />) ||
        (pathname === "/loginstep/step6" && <NavbarThird />) ||
        (pathname === "/loginstep/step7" && <NavbarThird />) ||
        (pathname === "/loginstep/step2" && <NavbarThird />)||
          (pathname === "/loginstep/step8" && <NavbarThird />)||
        (pathname === "/loginstep/step9" && <NavbarThird />)||
        (pathname === "/loginstep/step10" && <NavbarThird />)
        
        }
      
     
     
     
      {pathname === "/login" && <NavbarSecond />}
      {pathname !== "/" &&
        pathname !== "/login" &&
        pathname !== "/loginstep" &&
        pathname !== "/legal-terms" &&
        pathname !== "/privacyinfo" &&
        pathname !== "/support" &&
        pathname !== "/loginstep/step2" &&
        pathname !== "/loginstep/step3" &&
        pathname !== "/loginstep/step4" &&
        pathname !== "/loginstep/step5" &&
        pathname !== "/loginstep/step6" &&
        pathname !== "/loginstep/step7"&&
        pathname !== "/loginstep/step8"&&
          pathname !== "/loginstep/step9"&&
           pathname !== "/loginstep/step10"&&
         <Navbar />}
    </>
  );
};

export default NavbarMain;
