import { Game } from "./game.js";
import { MessageLogger } from "./messageLogger.js";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

const logger = new MessageLogger();
const game = new Game(logger);
