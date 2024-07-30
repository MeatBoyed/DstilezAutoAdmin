import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import React from "react";
import { searchParams } from "../page";

export function PaginationController({
  totalPages,
  currentPage,
  searchParams,
}: {
  totalPages: number;
  currentPage: number;
  searchParams: searchParams;
}) {
  return (
    <Pagination className="w-full justify-center items-center">
      <PaginationContent>
        {currentPage > 1 && (
          <>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                href={`/?page=${currentPage - 1}&order=${searchParams.order}&fueltype=${searchParams.fueltype}&make=${
                  searchParams.make
                }&transmission=${searchParams.transmission}&bodytype=${searchParams.bodytype}&color=${searchParams.color}`}
              />
            </PaginationItem>

            {currentPage > 2 && (
              <PaginationItem className="hidden sm:block">
                <PaginationLink
                  isActive={false}
                  href={`/?page=${1}&order=${searchParams.order}&fueltype=${searchParams.fueltype}&make=${
                    searchParams.make
                  }&transmission=${searchParams.transmission}&bodytype=${searchParams.bodytype}&color=${searchParams.color}`}
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Show if more pages available */}
            {currentPage > 2 && (
              <PaginationItem className="hidden sm:block">
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {/* Show Active link */}
        <PaginationItem>
          <PaginationLink
            isActive={true}
            href={`/?page=${currentPage}&order=${searchParams.order}&fueltype=${searchParams.fueltype}&make=${searchParams.make}&transmission=${searchParams.transmission}&bodytype=${searchParams.bodytype}&color=${searchParams.color}`}
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {currentPage < totalPages && (
          <>
            <PaginationItem>
              <PaginationLink
                isActive={false}
                href={`/?page=${currentPage + 1}&order=${searchParams.order}&fueltype=${searchParams.fueltype}&make=${
                  searchParams.make
                }&transmission=${searchParams.transmission}&bodytype=${searchParams.bodytype}&color=${searchParams.color}`}
              >
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>

            {currentPage < totalPages - 2 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    isActive={false}
                    href={`/?page=${currentPage + 2}&order=${searchParams.order}&fueltype=${searchParams.fueltype}&make=${
                      searchParams.make
                    }&transmission=${searchParams.transmission}&bodytype=${searchParams.bodytype}&color=${searchParams.color}`}
                  >
                    {currentPage + 2}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            {currentPage < totalPages - 3 && (
              <PaginationItem className="hidden sm:block">
                <PaginationLink
                  isActive={false}
                  href={`/?page=${currentPage + 3}&order=${searchParams.order}&fueltype=${searchParams.fueltype}&make=${
                    searchParams.make
                  }&transmission=${searchParams.transmission}&bodytype=${searchParams.bodytype}&color=${searchParams.color}`}
                >
                  {currentPage + 3}
                </PaginationLink>
              </PaginationItem>
            )}

            {currentPage < totalPages - 1 && currentPage < totalPages - 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Show Last page */}
            {currentPage != totalPages - 1 && (
              <PaginationItem>
                <PaginationLink
                  isActive={false}
                  href={`/?page=${totalPages}&order=${searchParams.order}&fueltype=${searchParams.fueltype}&make=${searchParams.make}&transmission=${searchParams.transmission}&bodytype=${searchParams.bodytype}&color=${searchParams.color}`}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Next button */}
            <PaginationItem>
              <PaginationNext
                href={`/?page=${currentPage + 1}&order=${searchParams.order}&fueltype=${searchParams.fueltype}&make=${
                  searchParams.make
                }&transmission=${searchParams.transmission}&bodytype=${searchParams.bodytype}&color=${searchParams.color}`}
              />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}
