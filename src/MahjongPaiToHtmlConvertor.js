import { SIZE } from './constants.js';

export default class MahjongPaiToHtmlConvertor {
  convert(outputSet, options) {
    let scale = this.getScaleFromOption(options.checkedSizeOption, options.customSize);
    let outputHtml = "";

    outputSet.forEach((pai) => {
      if (this.isSpace(pai)) {
        outputHtml += "<div style='width: " + (10 * scale) + "px; display: inline-block;'></div>";// TODO adjust with size
      } else if (this.isSpilter(pai)) {
        outputHtml += "<div style='width: " + (30 * scale) + "px; display: inline-block;'></div>";// TODO adjust with size
      } else if (this.isKan(pai)) {
        pai = pai[0].toLowerCase() + pai.substring(1);
        outputHtml += "<div style='display: inline-block; height: " + (60 * scale) + "px'>";
        outputHtml += "<img style='display: block' src='" + options.hostUrl + pai + ".gif' height='" + (30 * scale) + "px'>";
        outputHtml += "<img style='display: block' src='" + options.hostUrl + pai + ".gif' height='" + (30 * scale) + "px'>";
        outputHtml += "</div>";
      } else if (this.isRotation(pai)) {
        if (pai[0] === "b") {
          outputHtml += "<img src='" + options.hostUrl + "ura.gif' height='" + (40 * scale) + "px'>";
        } else {
          outputHtml += "<img src='" + options.hostUrl + pai + ".gif' height='" + (30 * scale) + "px'>";
        }
      } else {
        outputHtml += "<img src='" + options.hostUrl + pai + ".gif' height='" + (40 * scale) + "px'>";
      }
    });

    return outputHtml;
  }

  isSpace(pai) {
    return pai === " ";
  }

  isSpilter(pai) {
    return pai === "|";
  }

  isKan(pai) {
    return pai[0] === "L" || pai[0] === "R";
  }

  isRotation(pai) {
    return pai[0] === "l" || pai[0] === "r" || pai[0] === "b";
  }

  getScaleFromOption(checkedSizeOption, customSize) {
    let size;
    let standardSize = 40;
    switch(checkedSizeOption) {
      case SIZE.SMALL:
        size = "25";
        break;
      case SIZE.MIDDLE:
        size = "40";
        break;
      case SIZE.BIG:
        size = "60";
        break;
      case SIZE.CUSTOM:
        if (this.isNumber(customSize)) {
          $("#customSizeErrorLabel").css({"display": "none"});
          size = customSize;
        } else {
          $("#customSizeErrorLabel").css({"display": "inline-block"});
          size = "40";
        }
        break;
      default:
        size = "40";
    }

    return size/standardSize;
  }

  isNumber(n) {
    return Number(n) == n;
  }
}