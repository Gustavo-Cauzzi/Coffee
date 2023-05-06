import { CircularProgress } from "@mui/material";

interface LoadingOverlayProps {
  active: boolean;
}

export const LoadingOverlay = ({ active }: LoadingOverlayProps) => {
  if (!active) return <></>;
  return (
    <div className="fixed inset-0 bg-[#000000aa] flex items-center justify-center">
      <div className="bg-white rounded-full flex items-center justify-center p-4">
        <CircularProgress />
      </div>
    </div>
  );
};
