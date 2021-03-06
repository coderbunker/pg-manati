/**
 * Manati PostgreSQL REST API
 * Copyright (C) 2016 Sylvain Verly
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";

var test = new ManatiIntegrationTest(__dirname + '/../bootstrap.sql');
const chance = require('chance').Chance();
const async = require('async');
const sprintf = require("sprintf-js").sprintf;

var log = function (res) {
  console.log(res.body);
};

var checkLength = function(route, length) {
  return function(cb) {
    test.app.get(route).expect((res) => {
      res.body.should.have.length(length);
    }).expect(200).end(cb);
  };
};

describe('PATCH /data/:table', function (done) {
  before(function (done) {
    test.start()
      .then(function () {
        done();
      })
      .catch((error) => {
        console.error(`exec error: ${error}`);
        done();
      });
  });

  it('PATCH /data/uuid_data?uuid=199F5EFB-2DF6-42CF-90D7-61D90212C74A', function (done) {
    var uuid = chance.guid();

    async.series([
      function(cb) {test.app.patch('/data/uuid_data?uuid=199F5EFB-2DF6-42CF-90D7-61D90212C74A')
        .set('Content-Type', 'application/json')
        .send({
          uuid: uuid
        })
        .expect(200, [{uuid: uuid}]).end(cb);
      },
      checkLength('/data/uuid_data', 3)
    ], done);
  });

  it('PATCH /data/number_data?smallint_number=gte::32767', function (done) {
    async.series([
      function (cb) {
        test.app.patch('/data/number_data?smallint_number=gte::32767')
          .set('Content-Type', 'application/json')
          .send({
            'int_number': 1
          })
          .expect(200, [{
            smallint_number: 32767,
            int_number: 1,
            bigint_number: '9223372036854775807',
            decimal_number: '1.2',
            numeric_number: '1.3',
            real_number: 0.1,
            double_number: 0.000000000000001
          }])
          .end(cb);
      },
      checkLength('/data/number_data', 2)
    ], done);
  });

  after(function (done) {
    test.stop(done);
  });
});
