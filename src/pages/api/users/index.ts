// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { FaunaArrayResponse, FaunaResponse, fauna } from "@shared/services/fauna";
import { sha256 } from "js-sha256";
import type { NextApiRequest, NextApiResponse } from "next";

import { Collection, Create, Documents, Get, Index, Lambda, Map, Match, Paginate, Ref, Update } from "faunadb";
import { User } from "@shared/@types/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("sadnoisanoi");
    if (req.method === "POST") {
        const { name, username, password } = req.body;

        const existentUsername = await findUserByUsername(username);
        if (existentUsername) {
            res.status(270).json({ message: "Username já registrado" });
            return;
        }

        const hashedPassowrd = sha256(password);

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
    } else if (req.method === "GET") {
        const usersResponse: FaunaArrayResponse<User[]> = await fauna.query(
            Map(
                Paginate(Documents(Collection("users"))),
                Lambda((x) => Get(x))
            )
        );
        return res.status(200).json({ users: usersResponse.data.flatMap((d) => ({ ...d.data, id: d.ref.id })) });
    } else if (req.method === "PATCH") {
        const { id: ref, ...user } = req.body as User;

        try {
            await fauna.query(
                Update(Ref(Collection("users"), ref), {
                    data: user,
                })
            );
            return res.status(201).json({ message: "Usuário alterado" });
        } catch (e) {
            console.error(e);
            return res.status(280).json({ message: `${e}` });
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
