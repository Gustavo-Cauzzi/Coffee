import { HomeTabs } from "@shared/@types/HomeTabs";
import { PropsWithChildren, ReactNode, createContext, useContext, useState } from "react";
type ActionMap = Record<HomeTabs, ReactNode>;

interface FolderActionContext {
  actionButton: ActionMap;
  addActionButton: (tab: HomeTabs, content: ReactNode) => void;
}

const context = createContext({} as FolderActionContext);

export const FolderActionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [actions, setActions] = useState<ActionMap>({} as ActionMap);

  const addActionButton = (tab: HomeTabs, content: ReactNode) => {
    setActions((state) => ({ ...state, [tab]: content }));
  };

  return <context.Provider value={{ actionButton: actions, addActionButton }}>{children}</context.Provider>;
};

export const useFolderActions = () => useContext(context);
