"use client";

import AdminHeader from "@admin/AdminHeader";
import Filter from "@admin/Filter";
import List from "src/components/list/List";

const page = ({}) => {
  return (
    <>
      <AdminHeader />
      <Filter />
      <List isAdmin={true} />
    </>
  );
};

export default page;
