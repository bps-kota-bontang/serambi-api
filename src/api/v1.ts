import { Hono } from "hono";

import auth from "@/routes/auth";
import users from "@/routes/user";

const app = new Hono();

app.route("/auth", auth);
app.route("/users", users);


export default app;
