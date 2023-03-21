import { Players, ReplicatedStorage, ServerStorage } from "@rbxts/services";
import { createBindable } from "shared/Event";

function getSharedMinigameFolder(): Folder {
	let folder: Folder | undefined = ReplicatedStorage.FindFirstChild("Minigames") as Folder | undefined;
	if (!folder) {
		folder = new Instance("Folder");
		folder.Name = "Minigames";
		folder.Parent = ReplicatedStorage;
	}
	return folder;
}

function getMinigameFolder(): Folder | undefined {
	return ServerStorage.FindFirstChild("Minigames") as Folder | undefined;
}

export interface MinigameSettings {
	showParts: boolean;
}

export class Minigame {
	private currentDuration: number;
	private minigameFolder: Folder | undefined;
	private eventsFolder: Folder | undefined;
	constructor(private readonly name: string, private readonly duration: number) {
		this.currentDuration = duration;
		const minigames = getMinigameFolder();
		if (!minigames) {
			error("MINIGAMES FOLDER COULD NOT BE FOUND!");
			return;
		}
		this.minigameFolder = minigames.FindFirstChild(name) as Folder | undefined;
		if (!this.minigameFolder) {
			error(`Minigame ${this.name} could not be found!`);
		}

		const sharedMinigame = this.getSharedFolder();

		this.eventsFolder = sharedMinigame.FindFirstChild("Events") as Folder | undefined;
		if (!this.eventsFolder) {
			this.eventsFolder = new Instance("Folder");
			this.eventsFolder.Parent = sharedMinigame;
			this.eventsFolder.Name = "Events";
		}
	}

	private getSharedFolder(): Folder {
		const sharedMinigames = getSharedMinigameFolder();
		let folder: Folder | undefined = sharedMinigames.FindFirstChild(this.name) as Folder | undefined;
		if (!folder) {
			folder = new Instance("Folder");
			folder.Name = this.name;
			folder.Parent = sharedMinigames;
		}
		return folder;
	}

	getSpawns(): BasePart[] | undefined {
		if (!this.minigameFolder) return;
		const spawns = this.minigameFolder.FindFirstChild("Spawns") as Folder | undefined;
		if (!spawns) {
			warn("No spawns folder was found, defaulting to 0 spawns");
			return;
		}
		return spawns.GetChildren() as BasePart[];
	}

	startMinigame(settings: MinigameSettings | undefined = undefined) {
		if (!this.getSpawns()) {
			warn("No spawns were found");
			return;
		}
		if ((this.getSpawns() as BasePart[]).size() < Players.GetChildren().size()) {
			warn("Stopping spawning, spawn count is less than player count");
		}
		const spawns = [...(this.getSpawns() as BasePart[])];
		Players.GetChildren().forEach((p) => {
			const player: Player = p as Player;
			const index = ~~(math.random() * spawns.size());
			const spawn = spawns[index];
			spawns.remove(index);
			if (settings && settings.showParts) {
				spawn.Parent = game.Workspace;
				spawn.Transparency = 0;
				spawn.CanCollide = true;
			} else {
				spawn.Transparency = 1;
				spawn.CanCollide = false;
			}

			(player.Character as Model).PivotTo(spawn.CFrame);
			print(`Set ${player.Name} spawn`);
			createBindable("SpawnSet", this.eventsFolder).Fire(player);
		});

		this.currentDuration = this.duration;
		task.spawn(() => {
			while (this.currentDuration >= 0) {
				print(this.currentDuration);
				this.currentDuration--;
				wait(1);
			}
		});
	}
}
