import app from "./app";
import { envServerSchema } from "./shared/types/env.schema";

//define port for app
const port = envServerSchema.PORT || 3001;

//app run
const server = app.listen(port, () => {
  console.info(`Server is online on port ${port}`);
});

server.on("error", (error) => {
  console.error("Server error:", error);
});