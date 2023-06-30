import { Server as NetServer, Socket } from "net";
import { NextRequest } from "next/server";
import Pusher from "pusher";

import { NextApiResponse } from "next";

export type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            pusher: Pusher;
        };
    };
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(req: NextRequest, res: NextApiResponseServerIO) {
    if (!res.socket.server.pusher) {
        console.log("New pusher server...");
        // adapt Next's net Server to http Server
        const pusher = new Pusher({
            appId: "1627440",
            key: "8a13f1500977643c14d0",
            secret: "a5cf24d0dbf14dd3be18",
            cluster: "us2",
            useTLS: true,
        });

        // append SocketIO server to Next.js socket server response
        res.socket.server.pusher = pusher;
    }
    res.end();
}
