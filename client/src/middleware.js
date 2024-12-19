import { stackMiddlewares } from "./middlewares/stackHandler";
import { withUser } from "./middlewares/withUser";

const middlewares = [];
export default stackMiddlewares(middlewares);