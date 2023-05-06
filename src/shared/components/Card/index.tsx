import { PropsWithChildren } from "react";

export const CoffeeCard = ({ children, ...props }: PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div {...props} className={`bg-coffee-light-200 rounded-3xl shadow-md p-7 ${props.className ?? ""}`}>
      {children}
    </div>
  );
};
