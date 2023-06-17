import { HomeTabs } from "../../../@types/HomeTabs";
import { ReactNode } from "react";
import { HistoryTab } from "./HistoryTab";
import { ChargeTab } from "./ChargeTab";
import { PaymentTab } from "./PaymentTab";

export const folderContent: Record<HomeTabs, ReactNode> = {
  histórico: <HistoryTab />,
  pagamentos: <PaymentTab />,
  cobrancas: <ChargeTab />,
};
