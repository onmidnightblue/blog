interface Props {
  handleReset: () => void;
}

const MapControls = ({ handleReset }: Props) => {
  return (
    <div className="absolute flex flex-col gap-2 -translate-y-1/2 top-1/2 right-2 z-100">
      <button onClick={handleReset} className="w-10 h-10 text-xs rounded-full">
        Reset
      </button>
    </div>
  );
};

export default MapControls;
