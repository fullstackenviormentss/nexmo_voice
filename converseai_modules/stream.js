/**
 * @file stream.js
 * @author scott@converse.ai
 * @description
 *
 * Generated by the converse-cli tool for use with the Converse AI
 * Plugins SDK. https://developers.converse.ai/
 */

'use strict';

const Status = require('@converseai/plugins-sdk').Status;
const ModuleResponse = require('@converseai/plugins-sdk').Payloads.Module.ModuleResponse;
const MessageMedia = require('@converseai/plugins-sdk').Payloads.Module.MessageMedia;
const RichMedia = require('@converseai/plugins-sdk').Payloads.RichMedia;
const Utils = require('../lib/utils.js');

module.exports = function stream(app, body) {

  var registrationData = body.payload.registrationData;
  var callbackUri = registrationData.callback_uri;

  var status = Status.SUCCESS;
  var messageType = MessageMedia.TYPE_COMMENT;

  var moduleParam = body.payload.moduleParam;

  var sendMediaAs = moduleParam.send_media_as;
  if (sendMediaAs == "QUESTION") {
    messageType = MessageMedia.TYPE_QUESTION;
  } else if (sendMediaAs == "ANSWER") {
    status = Status.STOP;
  }

  var streamUrl = moduleParam.stream_url;
  if (!streamUrl) {
    app.fail({
      httpStatus: 400,
      code: "REQUIRED_PARAMS_UNDEFINED",
      description: "Required parameter 'Stream URL' is undefined."
    });
    return;
  }

  var bargeIn = moduleParam.bargeIn;
  if (!bargeIn || messageType == MessageMedia.TYPE_COMMENT) {
    bargeIn = false;
  }

  var loop = 1;
  if (moduleParam.loop) {
    loop = parseInt(moduleParam.loop);
    if (isNaN(loop) || loop < 0) {
      loop = 1;
    }
  }

  var level = 0.0;
  if (moduleParam.level) {
    loop = parseInt(moduleParam.level);
    if (isNaN(loop)) {
      loop = 0.0;
    } else if (level > 1.0) {
      level = 1.0;
    } else if (level < -1.0) {
      level = -1.0;
    }
  }

  var ncco = [{
    action: "stream",
    streamUrl: [
      streamUrl
    ],
    bargeIn: bargeIn,
    loop: loop,
    level: level,
  }];

  if (messageType == MessageMedia.TYPE_QUESTION) {

    var options = Utils.getOutboundOptions(null, registrationData, moduleParam.input_options);

    var userId = body.payload.channelSetting.userId;
    var threadId = body.payload.channelSetting.threadId;

    var item = {
      action: "input",
      submitOnHash: options.submitOnHash,
      timeOut: options.timeOut,
      eventUrl: [
        callbackUri + "?action=response&to=" + threadId + "&from=" + userId
      ],
      eventMethod: "POST"
    };

    if (options.maxDigits) {
      item.maxDigits = options.maxDigits;
    }

    ncco.push(item);
  }

  var richMedia = new RichMedia();
  richMedia.setRichMediaType("ncco");
  richMedia.setRichMediaObject({
    ncco: ncco
  });

  var message = new MessageMedia();
  message.setMessageType(messageType);
  message.setMessageMedia(richMedia);

  var response = new ModuleResponse();
  response.setMessage(message);
  app.send(status, response);
};