const preferedLang = [
    hmFS.SysProGetChars("mmk_tb_lang"),
    DeviceRuntimeCore.HmUtils.getLanguage(),
    "en-US"
];
const strings = {};

export function listTranslations() {
  return strings.name;
}

export function extendLocale(data) {
  for(let key in data) {
    strings[key] = data[key];
  }
}

export function t(key) {
  if(!strings[key]) return key;

  for(let ln of preferedLang) {
    if(!strings[key][ln]) continue;
    return strings[key][ln];
  }

  return key;
}