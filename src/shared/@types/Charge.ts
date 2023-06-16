import { User } from "./User";

export interface Charge {
    quantity: number;
    maxPaymentDate: Date | null;
    personsIds: number[];
    user: Pick<User, "id" | "name">;
    id: string;
}
