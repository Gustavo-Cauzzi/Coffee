import { CircularProgress } from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import { Payment } from "@shared/@types/Payment";
import { findAllPayments } from "@shared/store/modules/paymentSlice";
import { AppDispatch, RootState } from "@shared/store/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export const PaymentTab: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });

  const payments = useSelector<RootState, Payment[]>((state) => state.payments.payments);

  useEffect(() => {
    if (!payments.length) {
      setIsLoading(true);
      dispatch(findAllPayments())
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
              columns={[]}
              rows={payments}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </div>
        )}
      </div>
    </>
  );
};
