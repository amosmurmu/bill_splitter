import { Env, Hono } from "hono";

const homes = new Hono<{ Bindings: Env }>();

homes.post("/homes", async (c) => {});

homes.post("/homes/:homeId/members", async (c) => {});

export default homes;
