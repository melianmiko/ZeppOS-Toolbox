const _i18n_data = {
	preferences: [
		hmFS.SysProGetChars("mmk_tb_lang"),
		DeviceRuntimeCore.HmUtils.getLanguage(),
		"en-US"
	]
}

function listTranslations() {
	const o = {};
	for(let key in _i18n_data) {
		if(key !== "preferences")
			o[key] = _i18n_data[key].name;
	}
	return o;
}

function t(key) {
	for(let ln of _i18n_data.preferences) {
		if(_i18n_data[ln] === undefined) continue;
		if(_i18n_data[ln][key] === undefined) continue
		return _i18n_data[ln][key];
	}

	return key;
}

function registerTranslation(name, data) {
	_i18n_data[name] = data;
}
