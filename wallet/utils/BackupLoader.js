import {FsUtils} from "../lib/FsUtils";
import {CardsStorage} from "../utils/CardsStorage";
import {CardTypes} from "../utils/database";

export function loadBackup(storage) {
	// Fetch file content
	const path = FsUtils.fullPath('backup.txt');
	const backupData = FsUtils.fetchTextFile(path).split("\n");
	console.log("LOAD BACKUP", backupData);

	for(let row of backupData) {
		let card = {},
			parts = row.substring(1).split(";");

		if(row[0] == "0") {
			const typeInfo = CardTypes[parts[0]];
			card = {
				format: typeInfo.format,
				icon: parts[0],
				content: parts[1]
			};
		} else if (row[0] == "1") {
			card = {
				icon: "",
				title: parts[0],
				content: parts[1],
				format: parts[2],
				color: parseInt(parts[3])
			};
		} else continue;

		card.filename = `card_${Math.round(Math.random() * 1e8)}.png`;
		card.index = storage.data.length;

		storage.data.push(card);
	}

	storage._write();
	hmFS.remove(path);
}
