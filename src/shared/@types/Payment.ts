import { Charge } from "./Charge";
import { User } from "./User";

export interface Payment {
    id: string;
    debtorUser: Pick<User, "id" | "name">;
    originUser: Pick<User, "id" | "name">;
    quantity: number;
    paid: boolean;
    maxPaymentDate: Date | null;
    idCharge: Charge["id"];
}
