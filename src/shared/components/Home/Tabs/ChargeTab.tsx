import {
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Charge } from "@shared/@types/Charge";
import { useFolderActions } from "@shared/context/FolderActionContext";
import { getApi } from "@shared/services/api";
import { RootState } from "@shared/store/store";
import { currencyFormatter } from "@shared/utils/formatters";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiChevronDown, FiChevronUp, FiPlusSquare } from "react-icons/fi";
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

  const getData = () => {
    setIsLoading(true);
    getApi()
      .get("/charges")
      .then((response) => setCharges(response.data))
      .catch(() => toast.error("Não foi possível buscar as cobranças"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!isManager) return;
    addActionButton(
      "cobrancas",
      <Button variant="contained" startIcon={<FiPlusSquare />} onClick={handleOpenNewCharge}>
        Nova cobrança
      </Button>
    );

    getData();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex justify-end">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Emissão</TableCell>
                    <TableCell>Data máxima</TableCell>
                    <TableCell>Cobrador</TableCell>
                    <TableCell>Qtd. Pagamentos</TableCell>
                    <TableCell>Pagos</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {charges.map((charge) => (
                    <Row row={charge} key={charge.id} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>

      <NewChargeFormDialog
        open={isNewChargeDialogOpen}
        onClose={() => {
          setIsNewChargeDialogOpen(false);
          getData();
        }}
      />
    </>
  );
};

interface RowProps {
  row: Charge;
}

const Row: React.FC<RowProps> = ({ row }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <FiChevronUp /> : <FiChevronDown />}
          </IconButton>
        </TableCell>
        <TableCell>{currencyFormatter.format(row.quantity)}</TableCell>
        <TableCell component="th" scope="row">
          {row.date.toLocaleDateString("pt-BR")}
        </TableCell>
        <TableCell>{row.maxPaymentDate?.toLocaleDateString("pt-BR") ?? "-"}</TableCell>
        <TableCell>{row.user.name}</TableCell>
        <TableCell>{row.personsIds.length}</TableCell>
        <TableCell>{row.payments?.filter((p) => p.paid).length}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <h6 className="text-coffee-light-600 text-xl">Pagamentos</h6>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Devedor</TableCell>
                  <TableCell>Pago</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {row.payments?.map((paymentRow) => (
                  <TableRow key={paymentRow.id}>
                    <TableCell component="th" scope="row">
                      {paymentRow.debtorUser.name}
                    </TableCell>
                    <TableCell>{paymentRow.paid ? "Sim" : "Não"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
