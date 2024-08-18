import { Hono } from "hono";

import auth from "@/routes/auth";
import service from "@/routes/service";
import team from "@/routes/team";
import users from "@/routes/user";

const app = new Hono();

app.route("/auth", auth);
app.route("/services", service);
app.route("/teams", team);
app.route("/users", users);


export default app;
