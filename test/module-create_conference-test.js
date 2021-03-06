/**
 * @file test/module-create_conference-test.js
 * @author scott@converse.ai
 * @description Create a conference call and return the access
 * code to access it
 *
 * Generated by the converse-cli tool for use with the Converse AI
 * Plugins SDK. https://developers.converse.ai/
 */

const request = require('supertest');
const expect = require('chai').expect;
const server = require('./lib/express');

describe('Create Conference', function() {

  /**
    it('base', function(done) {
      request(server)
        .post('/')
        .send({
          event: 'MODULE_EXEC',
          payload: {
            moduleId: 'create_conference',
            moduleParam: {
              name: undefined,
              record: undefined,
              moderator: undefined
            },
            registrationData: {
              application_id: undefined,
              api_key: undefined,
              api_secret: undefined,
              inbound: undefined,
              options: undefined,
              callback_uri: undefined,
              events: undefined
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