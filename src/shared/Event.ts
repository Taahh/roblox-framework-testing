import { ReplicatedStorage } from "@rbxts/services";

function createEventFolder(): Folder {
	let folder: Folder | undefined = ReplicatedStorage.FindFirstChild("Events") as Folder | undefined;
	if (!folder) {
		folder = new Instance("Folder");
		folder.Name = "Events";
		folder.Parent = ReplicatedStorage;
	}
	return folder;
}
export function createBindable(name: string, parent?: Folder | undefined): BindableEvent {
	const folder: Folder = parent ? parent : createEventFolder();
	let event: BindableEvent | undefined = folder.FindFirstChild(name) as BindableEvent | undefined;
	if (!event) {
		event = new Instance("BindableEvent");
		event.Name = name;
		event.Parent = folder;
	}
	return event;
}

export function createRemote(name: string, parent?: Folder | undefined): RemoteEvent {
	const folder: Folder = parent ? parent : createEventFolder();
	let event: RemoteEvent | undefined = folder.FindFirstChild(name) as RemoteEvent | undefined;
	if (!event) {
		event = new Instance("RemoteEvent");
		event.Name = name;
		event.Parent = folder;
	}
	return event;
}
