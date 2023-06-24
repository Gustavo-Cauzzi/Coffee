// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { FaunaArrayResponse, fauna } from "@shared/services/fauna";
import type { NextApiRequest, NextApiResponse } from "next";

import { History } from "@shared/@types/History";
import { Collection, Documents, Get, Lambda, Map, Paginate } from "faunadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const response = await fauna.query<FaunaArrayResponse<History>>(
                Map(
                    Paginate(Documents(Collection("histories"))),
                    Lambda((x) => Get(x))
                )
            );

            return res.status(200).json(response.data.flatMap((d) => ({ ...d.data, id: d.ref.id })));
        } catch (e) {
            console.error(e);
            res.status(404).json({ message: "Não foi possível buscar o histórico" });
        }
    }
}
