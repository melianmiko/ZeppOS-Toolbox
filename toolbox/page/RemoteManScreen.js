import '../../lib/zeppos/device-polyfill'
import { MessageBuilder } from '../../lib/zeppos/message'
import { RemManHandler } from '../../lib/mmk/remman/RemManHandler'
import { RemManPage } from '../../lib/mmk/remman/RemManPage'

import {Path} from "../../lib/mmk/Path";
import {deviceName} from "../../lib/mmk/DeviceIdentifier";
import {SCREEN_WIDTH, SCREEN_HEIGHT} from "../../lib/mmk/UiParams";

const basePath = new Path("full", "/storage");
const clientConfig = {
  screenWidth: 240,
  screenHeight: 240,
  deviceName: deviceName,
  imageCodec: "TGA-RGBA" // see zmake readme
}

const appId = 33904;
const messageBuilder = new MessageBuilder({ appId })
const requestHandler = new RemManHandler(basePath, clientConfig);

Page({
  onInit() {
    const page = new RemManPage(messageBuilder);
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
    messageBuilder.disConnect();
  },

})
