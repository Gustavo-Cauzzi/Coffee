// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { fauna } from "@shared/services/fauna";
import type { NextApiRequest, NextApiResponse } from "next";

import { Collection, Delete, Ref } from "faunadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("sadnoisanoi");
    if (req.method === "DELETE") {
        const { id } = req.query;
        try {
            await fauna.query(Delete(Ref(Collection("users"), id)));
            return res.status(202).json({ message: "Usuário excluído com sucesso" });
        } catch (e) {
            return res.status(280).json({ message: `${e}` });
        }
    }
}
