import { Hono } from "hono";
import homes from "./routes/home.routes";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/health", (c) => c.json({ status: "ok" }));

app.route("/api", homes);

export default app;
