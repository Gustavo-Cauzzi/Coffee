import { Button } from "@mui/material";
import { useFolderActions } from "@shared/context/FolderActionContext";
import { useEffect } from "react";
import { FiPlusSquare, FiShield } from "react-icons/fi";

export const PagamentosTab: React.FC = () => {
  const { addActionButton } = useFolderActions();

  useEffect(() => {
    addActionButton(
      "pagamentos",
      <Button variant="contained" startIcon={<FiPlusSquare />}>
        Novo pagamento
      </Button>
    );
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end"></div>
    </div>
  );
};
