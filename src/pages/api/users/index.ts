// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { FaunaResponse, fauna } from "@shared/services/fauna";
import { sha256 } from "js-sha256";
import type { NextApiRequest, NextApiResponse } from "next";

import { Collection, Create, Get, Index, Match } from "faunadb";
import { User } from "@shared/@types/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("asasdsadsadsasad");
    if (req.method === "POST") {
        const { name, username, password } = req.body;

        const existentUsername = await findUserByUsername(username);
        console.log("existentUsername: ", existentUsername);
        if (existentUsername) {
            res.status(270).json({ message: "Username já registrado" });
            return;
        }

        const hashedPassowrd = sha256(password);

        console.log("hashedPassowrd: ", hashedPassowrd);

        try {
            await fauna.query<FaunaResponse<User>>(
                Create(Collection("users"), {
                    data: {
                        name,
                        username,
                        password: hashedPassowrd,
                    },
                })
            );

            res.status(201).json({ message: "Usuário criado" });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Não foi possível cadastrar o usuário" });
        }
    } else {
        res.status(405).json({ message: "Método não suportado " });
    }
}

const findUserByUsername = async (username: string) => {
    try {
        const response = await fauna.query<FaunaResponse<User>>(Get(Match(Index("user_by_username"), username)));
        console.log("response findUserNByUsername: ", username, response);
        return response.data;
    } catch (e) {
        return null;
    }
};
