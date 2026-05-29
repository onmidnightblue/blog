import { useState } from "react";
import { useRestaurants } from "@hooks";
import { OperatingHourType, RestaurantType, SupabaseValue } from "@types";
import { SmallLoadingSpinner } from "@components/common";
import EditComponent from "src/components/list/listItem/EditComponent";
import ViewComponent from "./listItem/ViewComponent";

interface Props {
  restaurant: RestaurantType;
  isAdmin?: boolean;
}

const ListItem = ({ isAdmin, restaurant }: Props) => {
  const { id, is_complete } = restaurant || {};
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Record<string, SupabaseValue>>({});
  const {
    updateRestaurant,
    saveOperatingHours,
    errorId,
    fieldKey,
    isLoading,
    errorMessage,
  } = useRestaurants(id);

  const updateFormData = (data: Record<string, SupabaseValue>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const resetFormData = () => {
    setFormData({});
  };

  const hasChanges = Object.keys(formData).length > 0;

  const handleSave = async () => {
    const basicInfoData = { ...formData };
    delete basicInfoData.operating_hours;

    if (Object.keys(basicInfoData).length > 0) {
      await updateRestaurant({ id, data: basicInfoData });
    }

    if (formData.operating_hours) {
      await saveOperatingHours(
        formData.operating_hours as unknown as OperatingHourType[]
      );
    }
    resetFormData();
    setIsEditMode(false);
  };

  const handleSelected = async () => {
    await updateRestaurant({ id, data: { is_complete: !is_complete } });
  };

  return (
    <li className="relative py-2 border-b border-b-gray-200">
      <div className="flex flex-col">
        {isEditMode ? (
          <EditComponent
            restaurant={{
              ...restaurant,
              ...formData,
            }}
            errorId={errorId}
            fieldKey={fieldKey}
            errorMessage={errorMessage}
            updateFormData={updateFormData}
          />
        ) : (
          <ViewComponent restaurant={restaurant} />
        )}
        {isEditMode && (
          <div className="mt-4 text-xs text-blue-400">ID: {id}</div>
        )}
      </div>
      {isAdmin && (
        <div className={`absolute top-2 right-0 text-right px-1 text-sm`}>
          {isEditMode ? (
            <div className="flex gap-4">
              {isLoading && <SmallLoadingSpinner />}
              {!isLoading && (
                <>
                  <button
                    className="text-error disabled:text-placeholder disabled:cursor-not-allowed"
                    onClick={resetFormData}
                    disabled={!hasChanges}
                  >
                    RESTORE
                  </button>
                  <button
                    className="text-green-600 disabled:text-placeholder disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={!hasChanges}
                  >
                    SAVE
                  </button>
                  <button
                    className=" text-blue-400 cursor-pointer"
                    onClick={() => {
                      resetFormData();
                      setIsEditMode(false);
                    }}
                  >
                    CANCEL
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-4">
              <input
                type="checkbox"
                checked={is_complete}
                onChange={handleSelected}
                className="cursor-pointer"
              />
              <button onClick={() => setIsEditMode(true)}>EDIT</button>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default ListItem;
