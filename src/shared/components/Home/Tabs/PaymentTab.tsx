import { Checkbox, CircularProgress, IconButton } from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import { isFulfilled, isRejected } from "@reduxjs/toolkit";
import { Payment } from "@shared/@types/Payment";
import { User } from "@shared/@types/User";
import { useFolderActions } from "@shared/context/FolderActionContext";
import { getApi } from "@shared/services/api";
import { findAllPayments, updatePayment } from "@shared/store/modules/paymentSlice";
import { AppDispatch, RootState } from "@shared/store/store";
import { currencyFormatter } from "@shared/utils/formatters";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiRefreshCcw } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export const PaymentTab: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { addActionButton } = useFolderActions();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [loadingRows, setLoadingRows] = useState<Payment["id"][]>([]);

  const payments = useSelector<RootState, Payment[]>((state) => state.payments.payments);

  const getData = () => {
    setIsLoading(true);
    dispatch(findAllPayments())
      .unwrap()
      .catch(() => toast.error("Não foi possível buscar o histórico"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    addActionButton(
      "pagamentos",
      <div className="flex justify-end w-full">
        <IconButton onClick={getData} size="small">
          <FiRefreshCcw />
        </IconButton>
      </div>
    );

    if (!payments.length) getData();
  }, []);

  const handlePaymentChange = async (id: Payment["id"], checked: boolean) => {
    const paymentToEdit = payments.find((payment) => payment.id === id);
    if (!paymentToEdit) {
      toast.error("Não foi possível encontrar o pagamento para editar");
      return;
    }
    const toastId = toast.loading("Atualizando dados...");
    setLoadingRows((state) => [...state, id]);
    const result = await dispatch(updatePayment({ ...paymentToEdit, paid: checked }));

    if (isRejected(result)) {
      toast.error("Não foi possível atualizar o registro");
    } else {
      toast.success("Registro atualizado com sucesso!");
    }

    setLoadingRows((state) => state.filter((id) => id !== id));
    toast.dismiss(toastId);
  };

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
                { field: "originUser.id", headerName: "Cobrador", flex: 1, valueGetter: (p) => p.row.originUser.name },
                {
                  field: "quantity",
                  headerName: "Quantidade",
                  flex: 1,
                  valueGetter: (p) => currencyFormatter.format(p.value),
                },
                {
                  field: "maxPaymentDate",
                  headerName: "Data limite",
                  flex: 1,
                  valueGetter: (p) => p.value?.toLocaleDateString("pt-BR") ?? "-",
                },
                {
                  field: "paid",
                  headerName: "Pago",
                  width: 100,
                  headerAlign: "center",
                  align: "center",
                  renderCell: (p) =>
                    loadingRows.includes(p.row.id) ? (
                      <CircularProgress size={15} />
                    ) : (
                      <Checkbox checked={p.value} onChange={(_e, checked) => handlePaymentChange(p.row.id, checked)} />
                    ),
                },
              ]}
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
