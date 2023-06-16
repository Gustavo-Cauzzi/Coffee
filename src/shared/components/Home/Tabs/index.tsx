import { HomeTabs } from "../../../@types/HomeTabs";
import { ReactNode } from "react";
import { HistoricoTab } from "./HistoricoTab";
import { ChargeTab } from "./ChargeTab";
import { PaymentTab } from "./PaymentTab";

export const folderContent: Record<HomeTabs, ReactNode> = {
  histórico: <HistoricoTab />,
  pagamentos: <PaymentTab />,
  cobrancas: <ChargeTab />,
};
