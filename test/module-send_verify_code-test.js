/**
 * @file test/module-send_verify_code-test.js
 * @author scott@converse.ai
 * @description
 *
 * Generated by the converse-cli tool for use with the Converse AI
 * Plugins SDK. https://developers.converse.ai/
 */

const request = require('supertest');
const expect = require('chai').expect;
const server = require('./lib/express');

describe('Send Verify Code', function() {
  /**
    it('base', function(done) {
      request(server)
        .post('/')
        .send({
          event: 'MODULE_EXEC',
          payload: {
            moduleId: 'send_verify_code',
            moduleParam: {
              to: undefined
            },
            registrationData: {
              application_id: undefined,
              api_key: undefined,
              api_secret: undefined,
              inbound: undefined,
              options: undefined,
              callback_uri: undefined,
              events: undefined,
              sms_numbers: undefined
            }        }
        })
        .set('X_CONVERSE_APP_TOKEN', require('../app-token'))
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.have.property('status').to.equal(0);
          expect(res.body).to.have.property('value');
          done();
        });
    })
  **/
});