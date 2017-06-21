(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('./constants.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MahjongPaiToHtmlConvertor = function () {
  function MahjongPaiToHtmlConvertor() {
    _classCallCheck(this, MahjongPaiToHtmlConvertor);
  }

  _createClass(MahjongPaiToHtmlConvertor, [{
    key: 'convert',
    value: function convert(outputSet, options) {
      var _this = this;

      var url = options.hostUrl + _constants.STYLES[options.style] + "/";
      var scale = this.getScaleFromOption(options.checkedSizeOption, options.customSize);
      var outputHtml = "";

      outputSet.forEach(function (pai) {
        if (_this.isSpace(pai)) {
          outputHtml += "<div style='width: " + 10 * scale + "px; display: inline-block;'></div>"; // TODO adjust with size
        } else if (_this.isSpilter(pai)) {
          outputHtml += "<div style='width: " + 30 * scale + "px; display: inline-block;'></div>"; // TODO adjust with size
        } else if (_this.isKan(pai)) {
          pai = pai[0].toLowerCase() + pai.substring(1);
          outputHtml += "<div style='display: inline-block; height: " + 60 * scale + "px'>";
          outputHtml += "<img style='display: block' src='" + url + pai + ".gif' height='" + 30 * scale + "px'>";
          outputHtml += "<img style='display: block' src='" + url + pai + ".gif' height='" + 30 * scale + "px'>";
          outputHtml += "</div>";
        } else if (_this.isRotation(pai)) {
          if (pai[0] === "b") {
            outputHtml += "<img src='" + url + "ura.gif' height='" + 40 * scale + "px'>";
          } else {
            outputHtml += "<img src='" + url + pai + ".gif' height='" + 30 * scale + "px'>";
          }
        } else {
          outputHtml += "<img src='" + url + pai + ".gif' height='" + 40 * scale + "px'>";
        }
      });

      return outputHtml;
    }
  }, {
    key: 'isSpace',
    value: function isSpace(pai) {
      return pai === " ";
    }
  }, {
    key: 'isSpilter',
    value: function isSpilter(pai) {
      return pai === "|";
    }
  }, {
    key: 'isKan',
    value: function isKan(pai) {
      return pai[0] === "L" || pai[0] === "R";
    }
  }, {
    key: 'isRotation',
    value: function isRotation(pai) {
      return pai[0] === "l" || pai[0] === "r" || pai[0] === "b";
    }
  }, {
    key: 'getScaleFromOption',
    value: function getScaleFromOption(checkedSizeOption, customSize) {
      var size = void 0;
      var standardSize = 40;
      switch (checkedSizeOption) {
        case _constants.SIZE.SMALL:
          size = "24";
          break;
        case _constants.SIZE.MIDDLE:
          size = "32";
          break;
        case _constants.SIZE.BIG:
          size = "40";
          break;
        case _constants.SIZE.CUSTOM:
          if (this.isNumber(customSize)) {
            $("#customSizeErrorLabel").css({ "display": "none" });
            size = customSize;
          } else {
            $("#customSizeErrorLabel").css({ "display": "inline-block" });
            size = "40";
          }
          break;
        default:
          size = "40";
      }

      return size / standardSize;
    }
  }, {
    key: 'isNumber',
    value: function isNumber(n) {
      return Number(n) == n;
    }
  }]);

  return MahjongPaiToHtmlConvertor;
}();

exports.default = MahjongPaiToHtmlConvertor;

},{"./constants.js":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('./constants.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MahjongTextParser = function () {
  function MahjongTextParser() {
    _classCallCheck(this, MahjongTextParser);
  }

  _createClass(MahjongTextParser, [{
    key: 'parse',
    value: function parse(inputText) {
      var _this = this;

      var inputTextBlock = inputText.replace(/\s+/g, ' ').split('|');
      var outputSet = [];
      try {
        inputTextBlock.forEach(function (input) {
          var inputTextBlock = input.trim();
          var blockParseResult = _this.parseOneBlock(inputTextBlock);
          if (blockParseResult.status === _constants.PARSE_RESULT.SUCCESS) {
            outputSet = outputSet.concat(blockParseResult.outputSet);
            outputSet.push("|");
          } else {
            throw "Invalid input";
          }
        });
      } catch (e) {
        return {
          status: _constants.PARSE_RESULT.INVALID_INPUT
        };
      }
      outputSet.pop();
      var newOutputSet = outputSet.filter(function (e) {
        return !_this.isSpace(e) && e !== "|";
      });
      return {
        status: _constants.PARSE_RESULT.SUCCESS,
        outputSet: outputSet,
        paiCount: this.getPaiCount(outputSet)
      };
    }
  }, {
    key: 'parseOneBlock',
    value: function parseOneBlock(inputText) {
      var _this2 = this;

      var status = 0;
      var pos = 0;
      var prePai = {};
      var prePaiStack = [];
      var outputSet = [];
      while (pos < inputText.length) {
        var char = inputText.charAt(pos);
        /*
        console.log("status", status);
        console.log("pos", pos);
        console.log("char", char);
        console.log("prePai", prePai);
        console.log("prePaiStack", JSON.stringify(prePaiStack));
        console.log("outputSet", outputSet);
        console.log("-------------");
        */
        switch (status) {
          case 0:
            if (this.isNumber(char)) {
              prePai.number = char;
              prePaiStack.push(prePai);
              prePai = {};
              status = 1;
              pos++;
            } else if (this.isSpace(char)) {
              outputSet.push(" ");
              pos++;
              status = 0;
            } else if (this.isRotation(char)) {
              prePai.prefix = char;
              pos++;
              status = 2;
            } else if (this.isKan(char)) {
              prePai.prefix = char;
              pos++;
              status = 3;
            } else {
              return {
                status: _constants.PARSE_RESULT.INVALID_INPUT
              };
            }
            break;
          case 1:
            if (this.isNumber(char)) {
              prePai.number = char;
              prePaiStack.push(prePai);
              prePai = {};
              status = 1;
              pos++;
            } else if (this.isRotation(char)) {
              prePai = {};
              prePai.prefix = char;
              pos++;
              status = 2;
            } else if (this.isKan(char)) {
              prePai = {};
              prePai.prefix = char;
              pos++;
              status = 3;
            } else if (this.isSymbol(char)) {
              var _ret = function () {
                var symbol = char;
                try {
                  prePaiStack.forEach(function (prePai) {
                    if (_this2.isInvalidCombination(prePai.number, symbol)) {
                      throw "Invalide combination";
                    }

                    var pai = prePai.number + symbol;
                    if (prePai.prefix) {
                      pai = prePai.prefix + pai;
                    }
                    outputSet.push(pai);
                  });
                } catch (e) {
                  return {
                    v: {
                      status: _constants.PARSE_RESULT.INVALID_INPUT
                    }
                  };
                }
                prePaiStack = [];
                pos++;
                status = 0;
              }();

              if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            } else {
              return {
                status: _constants.PARSE_RESULT.INVALID_INPUT
              };
            }
            break;
          case 2:
            if (this.isNumber(char)) {
              prePai.number = char;
              prePaiStack.push(prePai);
              prePai = {};
              status = 1;
              pos++;
            } else {
              return {
                status: _constants.PARSE_RESULT.INVALID_INPUT
              };
            }
            break;
          case 3:
            if (this.isNumber(char) && char === inputText.charAt(pos + 1)) {
              prePai.number = char;
              prePaiStack.push(prePai);
              prePai = {};
              status = 1;
              pos += 2;
            } else {
              return {
                status: _constants.PARSE_RESULT.INVALID_INPUT
              };
            }
            break;
          default:
            return {
              status: _constants.PARSE_RESULT.INVALID_INPUT
            };
        }
      }

      //console.log("outputSet", outputSet);
      // when input text doesn't end with a symbol
      if (prePaiStack.length !== 0) {
        return {
          status: _constants.PARSE_RESULT.INVALID_INPUT
        };
      } else {
        return {
          status: _constants.PARSE_RESULT.SUCCESS,
          outputSet: outputSet
        };
      }
    }
  }, {
    key: 'isNumber',
    value: function isNumber(char) {
      return (/^[0-9]$/.test(char)
      );
    }
  }, {
    key: 'isSpace',
    value: function isSpace(char) {
      return char === " ";
    }
  }, {
    key: 'isRotation',
    value: function isRotation(char) {
      return char === "l" || char === "r" || char === "b";
    }
  }, {
    key: 'isKan',
    value: function isKan(char) {
      return char === "L" || char === "R";
    }
  }, {
    key: 'isSymbol',
    value: function isSymbol(char) {
      return char === "m" || char === "p" || char === "s" || char === "z";
    }
  }, {
    key: 'isInvalidCombination',
    value: function isInvalidCombination(pai) {
      return pai === "0z" || pai === "8z" || pai === "9z";
    }
  }, {
    key: 'getPaiCount',
    value: function getPaiCount(outputSet) {
      var _this3 = this;

      return outputSet.filter(function (e) {
        return !_this3.isSpace(e) && e !== "|";
      }).length + outputSet.filter(function (e) {
        return _this3.isKan(e[0]);
      }).length;
    }
  }]);

  return MahjongTextParser;
}();

exports.default = MahjongTextParser;

},{"./constants.js":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SIZE = exports.SIZE = {
  SMALL: "1",
  MIDDLE: "2",
  BIG: "3",
  CUSTOM: "4"
};

var DEFAULT_IMG_URL = exports.DEFAULT_IMG_URL = "https://raw.githubusercontent.com/matsumatsu233/mahjong-pai-converter/master/sources/";
var STYLES = exports.STYLES = ["mj-dragon", "mj-tactics"];

var PARSE_RESULT = exports.PARSE_RESULT = {
  SUCCESS: 0,
  INVALID_INPUT: 1
};

},{}],4:[function(require,module,exports){
"use strict";

var _MahjongTextParser = require("./MahjongTextParser.js");

var _MahjongTextParser2 = _interopRequireDefault(_MahjongTextParser);

var _MahjongPaiToHtmlConvertor = require("./MahjongPaiToHtmlConvertor.js");

var _MahjongPaiToHtmlConvertor2 = _interopRequireDefault(_MahjongPaiToHtmlConvertor);

var _constants = require("./constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// these variables are being used as static classes, TODO if any better solution exsits
var mahjongTextParser = new _MahjongTextParser2.default();
var mahjongPaiToHtmlConvertor = new _MahjongPaiToHtmlConvertor2.default();

$(document).ready(function (e) {
  $("#convert").click(function () {
    var style = $("input[name=style]:checked").val();
    var checkedSizeOption = $("input[name=size]:checked").val();
    var customSize = $("#customSize>input").val();
    var hostUrl = _constants.DEFAULT_IMG_URL;

    var options = {
      style: style,
      checkedSizeOption: checkedSizeOption,
      customSize: customSize,
      hostUrl: hostUrl
    };

    var inputText = $("#inputText").val();

    saveLocalOptions(inputText, options);

    if (inputText) {
      var result = mahjongTextParser.parse(inputText);

      if (result.status === _constants.PARSE_RESULT.INVALID_INPUT) {
        $("#inputErrorLabel").css({ "display": "inline-block" });
        setShowArea("");
      } else {
        $("#inputErrorLabel").css("display", "none");

        var outputHtml = mahjongPaiToHtmlConvertor.convert(result.outputSet, options);
        setShowArea(outputHtml, result.paiCount);
      }
    } else {
      setShowArea("");
    }
  });

  $("#inputText").on("keydown", function (e) {
    if (e.which == 13) {
      $("#convert").click();
    }
  });

  $('input[type=radio][name=style]').change(function () {
    $("#convert").click();
  });

  $('input[type=radio][name=size]').change(function () {
    $("#customSizeErrorLabel").css({ "display": "none" });

    if ($("input[name=size]:checked").val() == _constants.SIZE.CUSTOM) {
      $("#customSize").removeClass("disabled");
      $("#customSize>input").focus();
    } else {
      $("#convert").click();
      $("#customSize").addClass("disabled");
    }
  });

  $('#customSize>input').blur(function () {
    $("#convert").click();
  });

  $('#customSize>input').on("keydown", function (e) {
    if (e.which == 13) {
      $("#convert").click();
    }
  });

  $("#outputTextarea").on("click", function () {
    $(this)[0].select();
  });

  readLocalOptions();
  $("#convert").click();
});

function setShowArea(innerHtml, paiCount) {
  $("#show-area").html(innerHtml + (paiCount ? "<div>(" + paiCount + "枚)</div>" : ""));
  $("#outputTextarea").val(innerHtml);

  if (innerHtml && isMjDragon()) {
    $("#warning-area").css("display", "block");
    $("#warning-area").html("麻雀の雀龍.com様が提供した牌画を使用する際、下記のメッセージをサイトに載せてください。利用初めの一度だけでも結構です。<a href='http://www.mj-dragon.com/yaku/haiga.html' target='_blank'>麻雀の雀龍.com 麻雀牌画の利用規約</a><br/><br/>");
    $("#warning-area").append(document.createTextNode("※ 画像は<a href='http://www.mj-dragon.com/rule/''>麻雀ルール</a>解説でおなじみの「麻雀の雀龍.com」の無料麻雀牌画を利用しています。"));
  } else {
    $("#warning-area").css("display", "none");
    $("#warning-area").html("");
  }
}

function saveLocalOptions(inputText, options) {
  localStorage.setItem("inputText", inputText);
  localStorage.setItem("options", JSON.stringify(options));
}

function readLocalOptions() {
  $("#inputText").val(localStorage.getItem("inputText"));

  var optionsStr = localStorage.getItem("options");
  var options = JSON.parse(optionsStr);
  $("input[name=style][value=" + options.style + "]").prop('checked', true);
  $("input[name=size][value=" + options.checkedSizeOption + "]").prop('checked', true);
  $("#customSize>input").val(options.customSize);
}

function isMjDragon() {
  return $("input[name=style][value=0]").is(':checked');
}

},{"./MahjongPaiToHtmlConvertor.js":1,"./MahjongTextParser.js":2,"./constants.js":3}]},{},[4]);
