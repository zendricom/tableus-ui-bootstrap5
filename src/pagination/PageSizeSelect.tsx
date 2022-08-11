import { PaginationTableConfig } from "@tableus/core/dist/core";
import React from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";

export function PageSizeSelect({
  pageSizeSelect,
  pageSize,
  setPageSize,
}: {
  pageSizeSelect: Required<PaginationTableConfig>["pageSizeSelect"];
  pageSize: number;
  setPageSize: (pageSize: number) => void;
}) {
  return (
    <BootstrapPagination className="bs5-page-size-select">
      {pageSizeSelect.map((size) => (
        <BootstrapPagination.Item
          active={size === pageSize}
          key={size}
          onClick={() => setPageSize(size)}
        >
          {size}
        </BootstrapPagination.Item>
      ))}
    </BootstrapPagination>
  );
}
