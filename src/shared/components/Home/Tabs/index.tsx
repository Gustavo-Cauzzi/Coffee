import { HomeTabs } from "@shared/pages/app";
import { ReactNode } from "react";
import { HistoricoTab } from "./HistoricoTab";
import { PagamentosTab } from "./PagamentosTab";

export const folderContent: Record<HomeTabs, ReactNode> = {
  histórico: <HistoricoTab />,
  pagamentos: <PagamentosTab />,
};