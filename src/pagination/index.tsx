import { PaginationProps } from "@tableus/core/dist/context";
import React from "react";
import { PageSelect } from "./PageSelect";
import { PageSizeSelect } from "./PageSizeSelect";

export function Pagination(props: PaginationProps) {
  const {
    paginationConfig,
    paginationState: { pageSize },
    paginationMethods: { setPageSize },
  } = props;
  return (
    <div className="bs5-pagination-wrapper">
      <PageSelect {...props} />

      {paginationConfig?.pageSizeSelect && (
        <PageSizeSelect
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageSizeSelect={paginationConfig.pageSizeSelect}
        />
      )}
    </div>
  );
}
