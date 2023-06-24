// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { FaunaArrayResponse, FaunaResponse, fauna } from "@shared/services/fauna";
import type { NextApiRequest, NextApiResponse } from "next";

import { Charge } from "@shared/@types/Charge";
import { Collection, Create, Documents, Get, Lambda, Map, Paginate } from "faunadb";
import { Payment } from "@shared/@types/Payment";
import { User } from "@shared/@types/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { maxPaymentDate, persons, quantity, user, date } = req.body as Omit<Charge, "personsIds"> & {
            persons: Pick<User, "id" | "name">[];
        };

        try {
            const response = await fauna.query<FaunaResponse<Charge>>(
                Create(Collection("charges"), {
                    data: {
                        maxPaymentDate,
                        quantity,
                        personsIds: persons.map((p) => p.id),
                        user,
                        date,
                    },
                })
            );

            const payments = persons.map((person) => ({
                debtorUser: person,
                idCharge: response.ref.id,
                maxPaymentDate: response.data.maxPaymentDate,
                originUser: {
                    id: user.id,
                    name: user.name,
                },
                paid: false,
                quantity: response.data.quantity,
            }));

            const responsePayments = await Promise.all(
                payments.map((data) =>
                    fauna.query<FaunaResponse<Charge>>(
                        Create(Collection("payments"), {
                            data,
                        })
                    )
                )
            );

            res.status(200).json({ charge: response.data, payments: responsePayments });
        } catch (e) {
            console.error(e);
            res.status(404).json({ message: "Não foi possível salvar o registro" });
        }
    } else if (req.method === "GET") {
        try {
            const charges: Charge[] = withIds(
                await fauna.query(
                    Map(
                        Paginate(Documents(Collection("charges"))),
                        Lambda((x) => Get(x))
                    )
                )
            );

            const payments: Payment[] = withIds(
                await fauna.query(
                    Map(
                        Paginate(Documents(Collection("payments"))),
                        Lambda((x) => Get(x))
                    )
                )
            );

            const response = charges.map((charge) => ({
                ...charge,
                payments: payments.filter((p) => p.idCharge === charge.id),
            }));

            return res.status(200).json(response);
        } catch (e) {
            console.error(e);
            res.status(404).json({ message: "Não foi possível buscar as cobranças" });
        }
    }
}

const withIds = <T>(faunaResponse: FaunaArrayResponse<T>) =>
    faunaResponse.data.flatMap((d) => ({ ...d.data, id: d.ref.id }));
