// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { FaunaArrayResponse, FaunaResponse, fauna } from "@shared/services/fauna";
import type { NextApiRequest, NextApiResponse } from "next";

import { Charge } from "@shared/@types/Charge";
import { Collection, Create, Documents, Get, Lambda, Map, Paginate } from "faunadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { maxPaymentDate, personsIds, quantity, user } = req.body as Charge;

        console.log("req.body: ", req.body);
        try {
            const response = await fauna.query<FaunaResponse<Charge>>(
                Create(Collection("charges"), {
                    data: {
                        maxPaymentDate,
                        quantity,
                        personsIds,
                        user,
                    },
                })
            );

            res.status(200).json(response.data);
        } catch (e) {
            console.error(e);
            res.status(404).json({ message: "Não foi possível salvar o registro" });
        }
    } else if (req.method === "GET") {
        try {
            const response = await fauna.query<FaunaArrayResponse<Charge>>(
                Map(
                    Paginate(Documents(Collection("charges"))),
                    Lambda((x) => Get(x))
                )
            );

            return res.status(200).json(response.data);
        } catch (e) {
            console.error(e);
            res.status(404).json({ message: "Não foi possível buscar as cobranças" });
        }
    }
}
