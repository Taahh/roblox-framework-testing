import { Minigame } from "./modules/Minigame";

const minigame = new Minigame("test", 300);
wait(5);
minigame.startMinigame({
	showParts: true,
});
