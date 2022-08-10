const _i18n_default = "en-US";
const _i18n_system = DeviceRuntimeCore.HmUtils.getLanguage();
const _i18n_data = {};

function t(key) {
	if(_i18n_data[_i18n_system] && _i18n_data[_i18n_system][key])
		return _i18n_data[_i18n_system][key];
	return _i18n_data[_i18n_default][key];
}

function registerTranslation(name, data) {
	_i18n_data[name] = data;
}
