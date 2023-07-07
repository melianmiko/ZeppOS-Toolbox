import '../lib/zeppos/device-polyfill'
import { MessageBuilder } from '../lib/zeppos/message'
import { RemManHandler } from '../lib/mmk/remman/RemManHandler'
import { RemManPage } from '../lib/mmk/remman/RemManPage'

import {Path} from "../lib/mmk/Path";
import {deviceName} from "../lib/mmk/DeviceIdentifier";
import {SCREEN_WIDTH, SCREEN_HEIGHT} from "../lib/mmk/UiParams";
import {VERSION} from "../version";

const { t } = getApp()._options.globalData;

const basePath = new Path("full", "/storage");
const clientConfig = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  deviceName: deviceName,
  appName: `Toolbox ${VERSION}`,
  welcome: t("Welcome to RemoteManager!"),
  imageCodec: "TGA-16",
  textEncoding: "utf8",
}

const appId = 33904;
const messageBuilder = new MessageBuilder({ appId })
const requestHandler = new RemManHandler(basePath, clientConfig);
const page = new RemManPage(messageBuilder, requestHandler);
page.gettext = t;

Page({
  onInit() {
    page.start();

    messageBuilder.connect(() => {
      page.onConnect();
    });
    messageBuilder.on("request", (ctx) => {
      const request = messageBuilder.buf2Json(ctx.request.payload);
      requestHandler.onRequest(ctx, request);
    });
  },

  onDestroy() {
    page.exit();
    messageBuilder.disConnect();
  },

})
