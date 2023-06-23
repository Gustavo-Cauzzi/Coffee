import { User } from "./User";

export interface History {
    id: string;
    user: Pick<User, "id" | "name">;
    created_at: Date;
}
