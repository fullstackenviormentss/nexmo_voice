/**
 * @file record.js
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

module.exports = function record(app, body) {

  var channelSetting = body.payload.channelSetting;

  if (channelSetting.runtimeCTX.recording) {
    handleRecoding(app, body, channelSetting.runtimeCTX.bodyData);
    return;
  }

  startRecoding(app, body);
}

function handleRecoding(app, body, recording) {

  var moduleParam = body.payload.moduleParam;

  var format = moduleParam.format;
  if (!format) {
    format = "mp3";
  }

  Utils.getPublicRecordingDetails(body, recording, format, function(ok, data) {
    if (!ok) {
      console.error(data);
      app.fail(data);
      return;
    }

    var response = new ModuleResponse();
    response.setValue(data);
    app.send(Status.SUCCESS, response);
  });

}

function startRecoding(app, body) {

  var userId = body.payload.channelSetting.userId;
  var threadId = body.payload.channelSetting.threadId;

  if (threadId.startsWith("sms_")) {
    app.send(Status.SUCCESS);
    return;
  }

  var registrationData = body.payload.registrationData;
  var callbackUri = registrationData.callback_uri;

  var moduleParam = body.payload.moduleParam;

  var format = moduleParam.format;
  if (!format) {
    format = "wav";
  }

  var endOnSilence = 3;
  if (moduleParam.endOnSilence) {
    endOnSilence = parseInt(moduleParam.endOnSilence);
    if (isNaN(endOnSilence) || endOnSilence < 0) {
      endOnSilence = 3;
    }
  }

  var endOnKey = null;
  if (moduleParam.endOnKey) {
    endOnKey = moduleParam.endOnKey;
  }

  var timeOut = null;
  if (moduleParam.timeOut) {
    timeOut = parseInt(moduleParam.timeOut);
    if (isNaN(timeOut)) {
      timeOut = null;
    } else if (timeOut > 7200) {
      timeOut = 7200;
    } else if (timeOut < 3) {
      timeOut = 3;
    }
  }

  var beepStart = moduleParam.beepStart;
  if (!beepStart) {
    beepStart = false;
  }

  var ncco = []

  if (moduleParam.start_message && moduleParam.start_message.message) {
    var options = Utils.getOutboundOptions(threadId, registrationData, moduleParam.start_message);

    var talk_ncco = {
      action: "talk",
      text: moduleParam.start_message.message,
      loop: options.loop,
    };

    if (options.voiceName) {
      talk_ncco.voiceName = options.voiceName;
    }

    ncco.push(talk_ncco);
  }

  var conversationUUID = body.payload.conversation.conversationUUID;

  ncco.push({
    action: "record",
    format: format,
    endOnSilence: endOnSilence,
    endOnKey: endOnKey,
    timeOut: timeOut,
    beepStart: beepStart,
    eventUrl: [
      callbackUri + "?action=recording&to=" + threadId + "&from=" + userId + "&conversationUUID=" + conversationUUID,
    ],
    eventMethod: "POST",
  });

  if (moduleParam.end_message && moduleParam.end_message.message) {
    var options = Utils.getOutboundOptions(threadId, registrationData, moduleParam.end_message);

    var talk_ncco = {
      action: "talk",
      text: moduleParam.end_message.message,
      loop: options.loop,
    };

    if (options.voiceName) {
      talk_ncco.voiceName = options.voiceName;
    }

    ncco.push(talk_ncco);
  }

  var richMedia = new RichMedia();
  richMedia.setRichMediaType("ncco");
  richMedia.setRichMediaObject({
    ncco: ncco
  });

  var message = new MessageMedia();
  message.setMessageType(MessageMedia.TYPE_COMMENT);
  message.setMessageMedia(richMedia);

  var response = new ModuleResponse();
  response.setMessage(message);
  app.send(Status.PAUSE, response);
};