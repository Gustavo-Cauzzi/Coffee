// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { FaunaArrayResponse, FaunaResponse, fauna } from "@shared/services/fauna";
import type { NextApiRequest } from "next";

import { History } from "@shared/@types/History";
import { Collection, Create, Documents, Get, Lambda, Map, Paginate } from "faunadb";
import { NextApiResponseServerIO } from "../pusher";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method === "POST") {
        const { user } = req.body as History;

        res.socket.server.pusher.trigger("coffee", "newCoffee", { name: user.name });

        try {
            const response = await fauna.query<FaunaResponse<History>>(
                Create(Collection("histories"), {
                    data: {
                        user,
                        created_at: new Date().toISOString(),
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
