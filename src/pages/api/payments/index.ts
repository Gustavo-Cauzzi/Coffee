// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { FaunaArrayResponse, fauna } from "@shared/services/fauna";
import type { NextApiRequest, NextApiResponse } from "next";

import { Payment } from "@shared/@types/Payment";
import { User } from "@shared/@types/User";
import { Collection, Get, Index, Lambda, Map, Match, Paginate, Ref, Update } from "faunadb";
import { decode } from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const jwt = req.cookies.jwt;
        if (!jwt) {
            return res.status(401).json({ message: "Não autorizado" });
        }
        const user = decode(jwt) as User;

        try {
            const response3: FaunaArrayResponse<Payment> = await fauna.query(
                Map(
                    Paginate(Match(Index("payments_by_debtor_id"), user.id)),
                    Lambda((x) => Get(x))
                )
            );

            return res.status(200).json(response3.data.flatMap((d) => ({ ...d.data, id: d.ref.id })));
        } catch (e) {
            console.error(e);
            res.status(404).json({ message: "Não foi possível buscar o histórico" });
        }
    } else if (req.method === "PUT") {
        const { id: ref, ...payment } = req.body as Payment;

        try {
            await fauna.query(
                Update(Ref(Collection("payments"), ref), {
                    data: payment,
                })
            );
            return res.status(201).json({ message: "Pagamento alterado" });
        } catch (e) {
            console.error(e);
            return res.status(280).json({ message: `${e}` });
        }
    }
}
