import { web } from "./application/web.js";
import { logger } from "./application/logging.js";

web.listen(9000, () => {
  logger.info("Service is running");
});
