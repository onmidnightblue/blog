"use client";

import { signOut } from "next-auth/react";
import { useSyncRestaurants } from "@hooks";
import { useState } from "react";
import NewRestaurantModal from "./NewRestaurantModal";
import { useRestaurantMutations } from "src/hooks/useRestaurantMutations";
import { SmallLoadingSpinner } from "@components/common";

const AdminHeader = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const { sync, isLoading } = useSyncRestaurants();
  const { createRestaurant, isCreating, error } = useRestaurantMutations();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between w-full p-4 bg-gray-100">
      <div className="flex items-baseline gap-2 font-bold font-paperozi">
        <h1 className="text-3xl text-foreground">국회밥안</h1>
        <h3 className="text-foreground text-md">관리자</h3>
      </div>
      <div className="flex gap-4 text-foreground font-paperozi">
        {/* {isDevelopment && (
          <div
            className="text-sm text-center cursor-pointer"
            onClick={() => setIsOpenCreateModal(true)}
          >
            생성
          </div>
        )} */}
        {isDevelopment && (
          <div
            className="text-sm text-center cursor-pointer"
            onClick={() => sync()}
          >
            {isLoading ? <SmallLoadingSpinner /> : "다운로드"}
          </div>
        )}
        <button
          className="text-sm cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/assembly-dining/admin" })}
        >
          로그아웃
        </button>
      </div>
      <NewRestaurantModal
        isOpen={isOpenCreateModal}
        onClose={() => setIsOpenCreateModal(false)}
        onSubmit={createRestaurant}
        isLoading={isCreating}
      />
    </header>
  );
};

export default AdminHeader;
