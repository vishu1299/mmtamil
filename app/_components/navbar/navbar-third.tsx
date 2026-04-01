import Image from "next/image";
import Link from "next/link";
import React from "react";

const NavbarThird = () => {
  return (
    <div className="sticky top-0 z-50 bg-[#ffffff] shadow-md">
      {/* <div className="max-w-[1560px]  w-[90%] mx-auto flex justify-center items-center ">
        <Link href={"/"}>
        <Image
          src="/assets/mmtlogo.png"
          alt="logo"
          width={200}
          height={30}
          className="md:w-[200px] w-[150px]"
        />
        </Link>
      </div> */}
    </div>
  );
};

export default NavbarThird;
