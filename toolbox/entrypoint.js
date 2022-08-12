/**
 * Open sub-page
 */
const gotoSubpage = (page, params) => {
  if(!params) params = {};

  hmApp.gotoPage({
    url: 'page/index',
    param: JSON.stringify({
      page, ...params
    })
  })
}


// Export module
let currentScreen = null;
let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    if(!p) p = '{"page": "main"}';
    const data = JSON.parse(p);
    console.log(data);

    switch(data.page) {
      case "main":
        currentScreen = new MainScreen(data);
        break;
      case "storage":
        currentScreen = new StorageScreen(data);
        break;
      case "customize":
        currentScreen = new CustomizeScreen(data);
        break;
      case "apps":
        currentScreen = new AppsListScreen(data);
        break;
      case "app_edit":
        currentScreen = new AppEditScreen(data);
        break;
      case "files":
        currentScreen = new FileManagerScreen(data);
        break;
      case "file_edit":
        currentScreen = new FileEditScreen(data);
        break;
      case "view_image":
        currentScreen = new ImageViewScreen(data);
        break;
      case "view_text":
        currentScreen = new TextViewScreen(data);
        break;
      case "view_hexdump":
        currentScreen = new HexdumpScreen(data);
        break;
      case "about":
        currentScreen = new AboutScreen(data);
        break;
      case "timer":
        currentScreen = new TimerScreen(data);
        break;
    }

    currentScreen.start();
  },
  onDestroy: () => {
    console.log(1);
    if(currentScreen.finish) 
      currentScreen.finish();
  }
});
