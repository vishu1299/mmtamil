"use client";
import React, { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationDemo({totalPages,currentPage,setCurrentPage}:{totalPages:number,currentPage:number,setCurrentPage:React.Dispatch<React.SetStateAction<number>>}) {
  // const totalPages = 10;
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // You can add router logic here if needed
  };

  const renderPaginationItems = () => {
    if (isSmallScreen) {
      return (
        <>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="w-10"
              isActive={currentPage === 1}
              onClick={() => goToPage(1)}
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis className="w-10" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              className="w-10"
              isActive={currentPage === totalPages}
              onClick={() => goToPage(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        </>
      );
    } else {
      return Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              className="w-10"
              isActive={page === currentPage}
              onClick={() => goToPage(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      });
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
          />
        </PaginationItem>
        {renderPaginationItems()}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
