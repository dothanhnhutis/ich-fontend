import React from "react";
import DisplayPagination from "./display-pagination";

const TvFooter = () => {
  return <DisplayPagination hasNextPage={2} totalItem={100} totalPage={10} />;
};

export default TvFooter;
