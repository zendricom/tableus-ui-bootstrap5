import React from "react";
import { PaginationProps } from "@tableus/core/dist/context";
import { Pagination as BootstrapPagination } from "react-bootstrap";

export function PageSelect({
  paginationMethods: {
    getCanPreviousPage,
    nextPage,
    previousPage,
    setPageIndex,
  },
  paginationState: { pageIndex, pageCount, total },
}: PaginationProps) {
  if (pageCount === undefined) return null;

  let sliderMin = pageIndex - 2;
  let sliderMax = pageIndex + 2;

  if (sliderMin < 0) sliderMin = 0;
  if (sliderMax > pageCount - 1) sliderMax = pageCount - 1;

  const slider = [];
  for (let i = sliderMin; i <= sliderMax; i++) {
    slider.push(i);
  }
  // const canNextPage = getCanNextPage(); broken atm
  const canNextPage = pageIndex < pageCount - 1;

  return (
    <div>
      <BootstrapPagination>
        <BootstrapPagination.Prev
          disabled={!getCanPreviousPage()}
          onClick={previousPage}
        />
        {sliderMin > 0 && (
          <BootstrapPagination.Item onClick={() => setPageIndex(0)}>
            {1}
          </BootstrapPagination.Item>
        )}
        {sliderMin > 1 && <BootstrapPagination.Ellipsis />}

        {slider.map((i) => (
          <BootstrapPagination.Item
            active={i == pageIndex}
            key={i}
            onClick={() => setPageIndex(i)}
          >
            {i + 1}
          </BootstrapPagination.Item>
        ))}

        {sliderMax < pageCount - 2 && <BootstrapPagination.Ellipsis />}

        {sliderMax < pageCount - 1 && (
          <BootstrapPagination.Item onClick={() => setPageIndex(pageCount - 1)}>
            {pageCount}
          </BootstrapPagination.Item>
        )}
        <BootstrapPagination.Next disabled={!canNextPage} onClick={nextPage} />
      </BootstrapPagination>
      {total !== undefined && (
        <span>
          {total} {total === 1 ? "Eintrag" : "Einträge"}
        </span>
      )}
    </div>
  );
}
