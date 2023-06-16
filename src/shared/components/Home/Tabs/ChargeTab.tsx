import { Button } from "@mui/material";
import { useFolderActions } from "@shared/context/FolderActionContext";
import { useEffect, useState } from "react";
import { FiPlusSquare } from "react-icons/fi";
import { NewChargeFormDialog } from "../NewChargeFormDialog";
import { useSelector } from "react-redux";
import { RootState } from "@shared/store/store";

export const ChargeTab: React.FC = () => {
  const { addActionButton } = useFolderActions();
  const [isNewChargeDialogOpen, setIsNewChargeDialogOpen] = useState(false);

  const isManager = useSelector<RootState, boolean>((state) => state.auth.user?.isGerente ?? false);

  const handleOpenNewCharge = () => {
    setIsNewChargeDialogOpen(true);
  };

  useEffect(() => {
    if (!isManager) return;
    addActionButton(
      "cobrancas",
      <Button variant="contained" startIcon={<FiPlusSquare />} onClick={handleOpenNewCharge}>
        Nova cobrança
      </Button>
    );
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end"></div>
      </div>

      <NewChargeFormDialog open={isNewChargeDialogOpen} onClose={() => setIsNewChargeDialogOpen(false)} />
    </>
  );
};
