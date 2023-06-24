import { CircularProgress, IconButton } from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import { History } from "@shared/@types/History";
import { useFolderActions } from "@shared/context/FolderActionContext";
import { findAllHistory } from "@shared/store/modules/historySlice";
import { AppDispatch, RootState } from "@shared/store/store";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiRefreshCcw } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export const HistoryTab: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { addActionButton } = useFolderActions();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });

  const histories = useSelector<RootState, History[]>((state) => state.history.history);

  const getData = () => {
    setIsLoading(true);
    dispatch(findAllHistory())
      .unwrap()
      .catch(() => toast.error("Não foi possível buscar o histórico"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    addActionButton(
      "histórico",
      <div className="flex justify-end w-full">
        <IconButton onClick={getData} size="small">
          <FiRefreshCcw />
        </IconButton>
      </div>
    );

    if (!histories.length) getData();
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
