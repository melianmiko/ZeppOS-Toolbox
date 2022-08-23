import {FsUtils} from "../../lib/FsUtils";
import {SystemApps} from "../utils/SystemApps";

let currentConfig = [];

function saveConfig() {
  const out = [];
  for(let conf of currentConfig) out.push({
    name: conf.name,
    key: conf.key,
    icon: conf.icon ? conf.icon : "i_" + conf.key + ".png",
    request: conf.request
  });

  const text = JSON.stringify(out);
  FsUtils.writeText("config.json", text);
}

function loadConfig() {
  try {
    currentConfig = FsUtils.fetchJSON("config.json");
  } catch(e) {
    console.log(e);
  }
}

function modifyAdd(conf) {
  currentConfig.push(conf);

  if(conf.realIcon)
    FsUtils.copy(conf.realIcon, FsUtils.getSelfPath() + "/assets/i_" + conf.key + ".png");
}

function modifyDel(conf) {
  try {
    hmFS.remove(FsUtils.getSelfPath() + "/assets/i_" + conf.key + ".png");
  } catch(e) {}

  currentConfig = currentConfig.filter((i) => i.key !== conf.key);
}

function fetchUserAppConfig(dirname) {
  const root = "/storage/js_apps/" + dirname;
  const appJson = FsUtils.fetchJSON(root + "/app.json");

  return {
    key: appJson.app.appId,
    name: appJson.app.appName,
    realIcon: root + "/assets/" + appJson.app.icon,
    request: {
      appid: appJson.app.appId,
      url: appJson.module.page.pages[0]
    }
  }
}

function initView() {
  const [data, e] = hmFS.readdir("/storage/js_apps");
  let posY = 72;

  const displayed = [];

  for(let dirname of data) {
    try {
      const conf = fetchUserAppConfig(dirname);
      console.log(conf);
      posY = createToggleView(conf, posY);
      displayed.push(conf.key);
    } catch(e) {
      console.log(e);
    }
  }

  for(let conf of SystemApps) {
    posY = createToggleView(conf, posY);
    displayed.push(conf.key);
  }

  for(let i of currentConfig) {
    if(displayed.indexOf(i.key) < 0) {
      posY = createToggleView(i, posY);
    }
  }
}

function createToggleView(conf, posY) {
  let state = false;
  for(let i of currentConfig)
    if(i.key === conf.key) state = true;

  const view = hmUI.createWidget(hmUI.widget.BUTTON, {
    x: 8,
    y: posY,
    w: 192-16,
    h: 64,
    text: conf.name,
    text_size: 28,
    normal_color: state ? 0x555555 : 0x222222,
    press_color: state ? 0x666666 : 0x111111,
    click_func: () => {
      !state ? modifyAdd(conf) : modifyDel(conf);
      state = !state;
      view.setProperty(hmUI.prop.MORE, {
        x: 8,
        y: posY,
        w: 192-16,
        h: 64,
        text: conf.name,
        normal_color: state ? 0x555555 : 0x222222,
        press_color: state ? 0x666666 : 0x111111,
      })
    }
  });

  return posY + 64 + 8;
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit() {
    hmSetting.setBrightScreen(180);
    hmUI.setLayerScrolling(true);

    const t = timer.createTimer(0, 2000, () => {
      timer.stopTimer(t);
      loadConfig();
      initView();
    })
  },
  onDestroy() {
    saveConfig();
  }
});
