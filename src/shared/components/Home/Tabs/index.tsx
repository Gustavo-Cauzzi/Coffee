import { ReactNode } from "react";
import { HistoryTab } from "./HistoryTab";
import { ChargeTab } from "./ChargeTab";
import { PaymentTab } from "./PaymentTab";
import { HomeTabs } from "../../../../pages/coffee";

export const folderContent: Record<HomeTabs, ReactNode> = {
  histórico: <HistoryTab />,
  pagamentos: <PaymentTab />,
  cobrancas: <ChargeTab />,
};
