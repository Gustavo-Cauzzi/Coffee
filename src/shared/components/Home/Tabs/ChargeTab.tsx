import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Charge } from "@shared/@types/Charge";
import { useFolderActions } from "@shared/context/FolderActionContext";
import { getApi } from "@shared/services/api";
import { RootState } from "@shared/store/store";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiPlusSquare } from "react-icons/fi";
import { useSelector } from "react-redux";
import { NewChargeFormDialog } from "../NewChargeFormDialog";

export const ChargeTab: FC = () => {
  const { addActionButton } = useFolderActions();
  const [isNewChargeDialogOpen, setIsNewChargeDialogOpen] = useState(false);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isManager = useSelector<RootState, boolean>((state) => state.auth.user?.isManager ?? false);

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

    setIsLoading(true);
    getApi()
      .get("/charges")
      .then((response) => setCharges(response.data))
      .catch(() => toast.error("Não foi possível buscar as cobranças"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <DataGrid
            density="compact"
            columns={[
              { field: "user.name", headerName: "Cobrador", flex: 1, valueGetter: (p) => p.row.user.name },
              {
                field: "quantity",
                flex: 1,
                valueGetter: (p) =>
                  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p.row.quantity),
              },
              {
                field: "pessoas.length",
                headerName: "Pagamentos",
                width: 100,
                valueGetter: (p) => p.row.personsIds.length,
              },
            ]}
            rows={charges}
          />
        </div>
      </div>

      <NewChargeFormDialog open={isNewChargeDialogOpen} onClose={() => setIsNewChargeDialogOpen(false)} />
    </>
  );
};
