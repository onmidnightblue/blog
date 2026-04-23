"use client";

import AdminHeader from "@admin/AdminHeader";
import Filter from "@admin/Filter";
import RestaurantList from "@admin/RestaurantList";

const page = ({}) => {
  return (
    <>
      <AdminHeader />
      <Filter />
      <RestaurantList />
    </>
  );
};

export default page;
