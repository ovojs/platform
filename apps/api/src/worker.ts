import { createApp } from "$libs/hono/app";
import { init } from "$libs/middlewares";
import { registerV1Zen } from "routes/v1/zen";

const app = createApp();

app.use("*", init());

registerV1Zen(app);

export default app;
