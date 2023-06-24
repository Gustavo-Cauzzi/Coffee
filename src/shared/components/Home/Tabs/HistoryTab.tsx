import { CircularProgress } from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import { History } from "@shared/@types/History";
import { findAllHistory } from "@shared/store/modules/historySlice";
import { AppDispatch, RootState } from "@shared/store/store";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export const HistoryTab: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });

  const histories = useSelector<RootState, History[]>((state) => state.history.history);

  useEffect(() => {
    if (!histories.length) {
      setIsLoading(true);
      dispatch(findAllHistory())
        .unwrap()
        .catch(() => toast.error("Não foi possível buscar o histórico"))
        .finally(() => setIsLoading(false));
    }
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex justify-end">
            <DataGrid
              density="compact"
              columns={[
                { field: "user.name", headerName: "Passador de café", flex: 1, valueGetter: (p) => p.row.user.name },
                {
                  field: "created_at",
                  headerName: "Horário",
                  flex: 1,
                  valueGetter: (p) =>
                    new Date(p.row.created_at).toLocaleTimeString("pt-BR") +
                    " " +
                    new Date(p.row.created_at).toLocaleDateString("pt-BR"),
                },
              ]}
              rows={histories}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </div>
        )}
      </div>
    </>
  );
};
