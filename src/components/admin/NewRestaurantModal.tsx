import { InnerInput, Modal, SmallLoadingSpinner } from "@components/common";
import { OperatingHourType, RestaurantType, SupabaseValue } from "@types";
import { useState } from "react";
import EditOperatingHour from "../list/listItem/EditOperatingHour";
import EditBasicInfo from "../list/listItem/EditBasicInfo";
import { RESTAURANT_ID_REGEX } from "@constants";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<RestaurantType>) => Promise<void>;
  isLoading: boolean;
}

const NewRestaurantModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: Props) => {
  const initRestaurant = {
    id: "",
    name: "",
    category: "",
    phone: "",
    keyword: "",
    land_address: "",
    status_number: "",
    is_visible: true,
    has_room: false,
    map_x: "",
    map_y: "",
    operating_hours: Array.from({ length: 7 }, (_, i) => ({
      id: i,
      day_of_week: i,
      is_off: false,
    })) as OperatingHourType[],
  };
  const [formData, setFormData] = useState(initRestaurant);
  const [error, setError] = useState("");

  const handleReset = () => {
    onClose();
    setFormData(initRestaurant);
    setError("");
  };

  const updateFormData = (data: Record<string, SupabaseValue>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<RestaurantType> = {
        id: formData.id || "",
        name: formData.name || "",
        category: formData.category || "",
        phone: formData.phone || "",
        land_address: formData.land_address || "",
        keyword: formData.keyword || "",
        status_number: formData.status_number || "01",
        is_visible: formData.is_visible || true,
        has_room: formData.has_room || false,
        map_x: formData.map_x || "",
        map_y: formData.map_y || "",
      };
      await onSubmit({
        ...payload,
        operating_hours: formData.operating_hours || [],
      });
      handleReset();
    } catch (error) {
      setError(String(error));
    }
  };

  return (
    <Modal isOpen={isOpen} closeModal={handleReset} title="새로운 식당">
      {error && <p className="text-error">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">필수</h3>
          <InnerInput
            label="식당ID"
            value={formData.id}
            onChange={(v) => updateFormData({ id: v })}
            error={
              formData.id && !RESTAURANT_ID_REGEX.test(formData.id)
                ? "7-3-4-5 자릿수를 확인해주세요"
                : null
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">기본 정보</h3>
          <EditBasicInfo
            restaurant={formData as RestaurantType}
            errorId={null}
            errorMessage={null}
            updateFormData={updateFormData}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">운영 시간</h3>
          <EditOperatingHour
            restaurant={formData as RestaurantType}
            errorId={null}
            errorMessage={null}
            updateFormData={updateFormData}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 rounded-lg disabled:bg-gray-400 absolute right-6 top-2"
        >
          {isLoading ? <SmallLoadingSpinner /> : "등록"}
        </button>
      </form>
    </Modal>
  );
};

export default NewRestaurantModal;
