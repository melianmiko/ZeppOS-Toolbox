import {FsUtils} from "../../lib/FsUtils";

import {db_path} from "./constants";

export class ContactStorage {
	static preload() {
		try {
			ContactStorage.data = FsUtils.fetchJSON(db_path);
		} catch(e) {
			ContactStorage.data = [
				{
					"name": "MelianMiko",
					"phone": "",
					"email": "support@melianmiko.ru",
					"notes": "Образец контакта. Донат - melianmiko.ru/donate"
				}
			];
		}
	}

	static write() {
		FsUtils.writeText(db_path, JSON.stringify(this.data));
	}

	static all() {
		if(!ContactStorage.data) ContactStorage.preload();
		return ContactStorage.data;
	}

	static update(id, data) {
		if(!ContactStorage.data) ContactStorage.preload();
		ContactStorage.data[id] = data;
		ContactStorage.write();
	}

	static getInsertId() {
		if(!ContactStorage.data) ContactStorage.preload();
		return ContactStorage.data.length;
	}

	static find(id) {
		if(!ContactStorage.data) ContactStorage.preload();
		if(!ContactStorage.data[id]) return {};
		return ContactStorage.data[id];
	}

	static delete(id) {
		if(!ContactStorage.data) ContactStorage.preload();

		const newData = [];
		for(let i = 0; i < ContactStorage.data.length; i++) {
			if(i == id) continue;
			newData.push(ContactStorage.data[i]);
		}

		ContactStorage.data = newData;
		ContactStorage.write();
	}
}
