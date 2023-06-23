import { DataGrid } from "@mui/x-data-grid";
import { History } from "@shared/@types/History";
import { getApi } from "@shared/services/api";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export const HistoryTab: FC = () => {
  const [histories, setHistories] = useState<History[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getApi()
      .get("/histories")
      .then((response) => {console.log(response.data); setHistories(response.data)})
      .catch(() => toast.error("Não foi possível buscar o histórico"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <DataGrid
            density="compact"
            columns={[
              { field: "user.name", headerName: "Passador de café", flex: 1, valueGetter: (p) => p.row.user.name },
              {
                field: "created_at",
                headerName: "Horário",
                flex: 1,
                valueGetter: (p) => new Date(p.row.created_at).toLocaleTimeString('pt-BR') + ' ' + new Date(p.row.created_at).toLocaleDateString('pt-BR'),
              },
            ]}
            rows={histories}
          />
        </div>
      </div>
    </>
  );
};
