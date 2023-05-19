import { HomeTabs } from "../../../../pages/coffee";
import { PropsWithChildren } from "react";

interface FolderTablProps {
  tabName: HomeTabs;
  selectedTab?: HomeTabs;
  onTabClick?: (tab?: HomeTabs) => any;
}
export const FolderTab: React.FC<PropsWithChildren<FolderTablProps>> = ({
  selectedTab,
  onTabClick,
  children,
  tabName,
}) => {
  const isCurrentSelectedTab = tabName === selectedTab;

  return (
    <div
      className={`folder-tab ${isCurrentSelectedTab ? "selected" : ""}`}
      onClick={() => onTabClick && onTabClick(isCurrentSelectedTab ? undefined : tabName)}
    >
      {children}
    </div>
  );
};
