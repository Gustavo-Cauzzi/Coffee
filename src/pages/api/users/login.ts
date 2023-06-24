// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { FaunaResponse, fauna } from "@shared/services/fauna";
import { sha256 } from "js-sha256";
import type { NextApiRequest, NextApiResponse } from "next";

import { User } from "@shared/@types/User";
import { Get, Index, Match } from "faunadb";
import { sign } from "jsonwebtoken";

const SUPER_HIPER_MEGA_SECRET = "otho_bananão_demais_>:)";

type UserResponse = Omit<User, "id"> & { password: string };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { username, password } = req.body;

        const hashedPassowrd = sha256(password);

        try {
            const user = await fauna.query<FaunaResponse<UserResponse>>(
                Get(Match(Index("user_by_username_and_password"), username, hashedPassowrd))
            );

            const { password: _password, ...userInfo } = user.data;

            const parsedUser = { id: user.ref.id, ...userInfo } as User;

            const jwt = sign(parsedUser, SUPER_HIPER_MEGA_SECRET);
            res.status(200).json({ token: jwt });
        } catch (e) {
            res.status(401).json({ message: "Usuário não encontrado" });
        }
    } else {
        res.status(405).json({ message: "Método não suportado " });
    }
}
