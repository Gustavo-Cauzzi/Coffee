import faunadb from "faunadb";

export const fauna = new faunadb.Client({
    secret: "fnAFDKOdMiAAUfPujpBDbuQS6g4VasPfHaNeLD7N",
    // NOTE: Use the correct endpoint for your database's Region Group.
    // endpoint: 'https://db.fauna.com/',
});

export const q = fauna.query;

export interface FaunaResponse<T extends any> {
    ref: {
        id: string;
    };
    data: T;
}

export interface FaunaArrayResponse<T extends any> {
    data: FaunaResponse<T>[];
}
