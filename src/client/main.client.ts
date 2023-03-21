import { Players, ReplicatedStorage } from "@rbxts/services";

Players.PlayerAdded.Connect((player) => {
	print("player joined");
});
