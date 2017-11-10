require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_Info_anu3_prog_mobile_git_MobileLabs_Koa_server_node_modules_babel_runtime_regenerator__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_E_Info_anu3_prog_mobile_git_MobileLabs_Koa_server_node_modules_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_E_Info_anu3_prog_mobile_git_MobileLabs_Koa_server_node_modules_babel_runtime_regenerator__);


var _this = this;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Koa = __webpack_require__(4);
var app = new Koa();
var server = __webpack_require__(5).createServer(app.callback());
var WebSocket = __webpack_require__(6);
var wss = new WebSocket.Server({ server: server });
var Router = __webpack_require__(7);
var cors = __webpack_require__(8);
var bodyparser = __webpack_require__(9);

app.use(bodyparser());

app.use(cors());

app.use(function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_Info_anu3_prog_mobile_git_MobileLabs_Koa_server_node_modules_babel_runtime_regenerator___default.a.mark(function _callee(ctx, next) {
    var start, ms;
    return __WEBPACK_IMPORTED_MODULE_0_E_Info_anu3_prog_mobile_git_MobileLabs_Koa_server_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // logger
            start = new Date();
            _context.next = 3;
            return next();

          case 3:
            ms = new Date() - start;

            console.log(ctx.method + ' ' + ctx.url + ' ' + ctx.response.status + ' - ' + ms + 'ms');

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

app.use(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_Info_anu3_prog_mobile_git_MobileLabs_Koa_server_node_modules_babel_runtime_regenerator___default.a.mark(function _callee2(ctx, next) {
    return __WEBPACK_IMPORTED_MODULE_0_E_Info_anu3_prog_mobile_git_MobileLabs_Koa_server_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return next();

          case 3:
            _context2.next = 9;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2['catch'](0);

            ctx.response.body = { issue: [{ error: _context2.t0.message || 'Unexpected error' }] };
            ctx.response.status = 500; // internal server error

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this, [[0, 5]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

var Tag = function Tag(_ref3) {
  var id = _ref3.id,
      name = _ref3.name,
      version = _ref3.version;

  _classCallCheck(this, Tag);

  this.id = id;
  this.name = name;
  this.version = version;
};

var tags = [];
tags.push(new Tag({ id: 1, name: 'food', version: 1 }));
tags.push(new Tag({ id: 2, name: 'bills', version: 1 }));
tags.push(new Tag({ id: 3, name: 'entertainment', version: 1 }));

var lastUpdated = new Date(Date.now());
var lastId = 3;
var pageSize = 10;

var broadcast = function broadcast(data) {
  return wss.clients.forEach(function (client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

var router = new Router();
router.get('/tag', function (ctx) {
  var ifModifiedSince = ctx.request.get('If-Modified-Since');
  if (ifModifiedSince && new Date(ifModifiedSince).getTime() >= lastUpdated.getTime() - lastUpdated.getMilliseconds()) {
    ctx.response.status = 304; // NOT MODIFIED
    return;
  }
  var text = ctx.request.query.text;
  var page = ctx.request.query.page || 1;
  ctx.response.set('Last-Modified', lastUpdated.toUTCString());
  var offset = (page - 1) * pageSize;
  ctx.response.body = {
    page: page,
    tags: tags.slice(offset, offset + pageSize),
    more: offset + pageSize < tags.length
  };
  ctx.response.status = 200; // OK
});

var createTag = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_Info_anu3_prog_mobile_git_MobileLabs_Koa_server_node_modules_babel_runtime_regenerator___default.a.mark(function _callee3(ctx) {
    var tag;
    return __WEBPACK_IMPORTED_MODULE_0_E_Info_anu3_prog_mobile_git_MobileLabs_Koa_server_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            tag = ctx.request.body;

            if (tag.name) {
              _context3.next = 5;
              break;
            }

            // validation
            ctx.response.body = { issue: [{ error: 'Name is missing' }] };
            ctx.response.status = 400; //  BAD REQUEST
            return _context3.abrupt('return');

          case 5:
            tag.id = '' + (parseInt(lastId) + 1);
            lastId = tag.id;
            tag.version = 1;
            tags.push(tag);
            ctx.response.body = tag;
            ctx.response.status = 201; // CREATED
            broadcast({ event: 'created', tag: tag });

          case 12:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, _this);
  }));

  return function createTag(_x5) {
    return _ref4.apply(this, arguments);
  };
}();

router.post('/tag', function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_E_Info_anu3_prog_mobile_git_MobileLabs_Koa_server_node_modules_babel_runtime_regenerator___default.a.mark(function _callee4(ctx) {
    return __WEBPACK_IMPORTED_MODULE_0_E_Info_anu3_prog_mobile_git_MobileLabs_Koa_server_node_modules_babel_runtime_regenerator___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return createTag(ctx);

          case 2:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, _this);
  }));

  return function (_x6) {
    return _ref5.apply(this, arguments);
  };
}());

app.use(router.routes());
app.use(router.allowedMethods());

server.listen(3000);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("regenerator-runtime");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("koa");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("ws");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("koa-router");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("koa-cors");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ })
/******/ ]);
//# sourceMappingURL=main.map