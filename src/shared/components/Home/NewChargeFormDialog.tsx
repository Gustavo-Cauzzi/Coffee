import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { Charge } from "@shared/@types/Charge";
import { User } from "@shared/@types/User";
import { getApi } from "@shared/services/api";
import { findAllCharges } from "@shared/store/modules/chargesSlice";
import { AppDispatch, RootState } from "@shared/store/store";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiInfo, FiSave, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { number, object } from "yup";

interface NewChargeFormDialogProps extends DialogProps {}

interface DefaultValues {
  quantity: string;
  maxPaymentDate: Date | null;
}

const schema = object({
  quantity: number().required("Informe uma quantidade"),
});

const defaultValues = {
  quantity: "",
  maxPaymentDate: null as null | Date,
};

export const NewChargeFormDialog = ({ onClose, ...props }: NewChargeFormDialogProps) => {
  const dispatch: AppDispatch = useDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [checkboxSelection, setCheckboxSelection] = useState<User["id"][]>([]);

  const user = useSelector<RootState, User | undefined>((state) => state.auth.user);

  useEffect(() => {
    const getData = async () => {
      type Response = { users: User[] };
      const response = await getApi().get<Response>("/users");
      setUsers(response.data.users.filter((u) => u.id !== user?.id));
    };

    getData();
  }, []);

  const handleClose = () => {
    reset(defaultValues);
    if (onClose) onClose({}, "backdropClick");
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DefaultValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: DefaultValues) => {
    if (!user) {
      toast.error("Usuário atual não encontrado");
      return;
    }

    const toastId = toast.loading("Salvando cobrança");
    try {
      await getApi()
        .post("/charges", {
          maxPaymentDate: data.maxPaymentDate,
          persons: checkboxSelection.map((id) => users.find((u) => u.id === id)),
          quantity: Number(data.quantity),
          user: {
            id: user.id,
            name: user.name,
          },
          date: new Date(),
        })
        .finally(() => toast.dismiss(toastId));
    } catch (e) {
      toast.error("Não foi possível salvar os dados");
      return;
    }

    toast.success("Cobrança criada. Pagadores serão notificados!");
    dispatch(findAllCharges())
      .unwrap()
      .catch(() => toast.error("Não foi possível buscar as cobranças"));
    handleClose();
  };

  return (
    <Dialog maxWidth="md" fullWidth onClose={handleClose} {...props}>
      <DialogTitle className="text-coffee-light-600">Nova cobrança</DialogTitle>
      <DialogContent>
        <div className="flex justify-between gap-4 flex-col sm:flex-row">
          <form id="chargeForm" onSubmit={handleSubmit(onSubmit)} className="py-2 gap-4 flex-col flex sm:pt-14">
            <Controller
              control={control}
              name="quantity"
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="0,00"
                  className="max-w-[13rem]"
                  type="number"
                  label="Quantidade*"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$ </InputAdornment>,
                  }}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message ?? ""}
                />
              )}
            />

            <div className="flex gap-2 items-center">
              <Controller
                control={control}
                name="maxPaymentDate"
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className="max-w-[13rem]"
                    disablePast
                    slotProps={{ textField: { label: "Data máxima" } }}
                  />
                )}
              />
              <Tooltip title="Data de prazo máximo que será informado a todos caso necessário">
                <div>
                  <IconButton size="small">
                    <FiInfo />
                  </IconButton>
                </div>
              </Tooltip>
            </div>
          </form>

          <div>
            <DataGrid
              columns={[{ field: "name", maxWidth: 500, flex: 1, headerName: "Nome" }]}
              rows={users}
              rowSelectionModel={checkboxSelection}
              onRowSelectionModelChange={(newSelection) => setCheckboxSelection(newSelection as User["id"][])}
              density="compact"
              className="mt-1"
              checkboxSelection
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              getRowId={(user) => user.id}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="outlined" type="submit" onClick={handleClose} startIcon={<FiX />}>
          Cancelar
        </Button>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          form="chargeForm"
          startIcon={<FiSave />}
          disabled={!checkboxSelection.length}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
