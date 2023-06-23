import { Payment } from "./Payment";
import { User } from "./User";

export interface Charge {
    quantity: number;
    date: Date;
    maxPaymentDate: Date | null;
    personsIds: number[];
    user: Pick<User, "id" | "name">;
    id: string;

    payments?: Payment[];
}
