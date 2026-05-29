interface Props {
  isWhite?: boolean;
}

const SmallLoadingSpinner = ({ isWhite }: Props) => {
  return (
    <div className="flex items-center pointer-events-none py-1 px-2">
      <div
        className={`w-3 h-3 border-2 rounded-full border-t-transparent animate-spin ${
          isWhite ? "border-white" : "border-blue-500"
        }`}
      />
    </div>
  );
};

export default SmallLoadingSpinner;
