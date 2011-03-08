
// Run $ expresso

/**
 * Module dependencies.
 */

process.env.NODE_ENV = 'test';

var app = require('../app')
  , assert = require('assert')
  , mongoose = require('mongoose');



module.exports = {
  'GET /documents': function(beforeExit){
    assert.response(app,
      { url: '/documents'},
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }},
      function(res){
        console.log(res.body);
        assert.includes(res.body, '<title>0</title>');
      });
  },
    'POST /documents': function(beforeExit){
    assert.response(app,
      { url: '/documents', method:'POST', data:JSON.stringify({data:'foo', title:'bar'}) },
      { status: 301, headers: { 'Content-Type': 'text/html; charset=utf-8' }},
      function(res){
        console.log(res.body);
        assert.includes(res.body, '<title>0</title>');
        mongoose.disconnect(); // gross!
      });
  }

};