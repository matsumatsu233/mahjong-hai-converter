import MahjongTextParser from "./MahjongTextParser.js";
import MahjongPaiToHtmlConvertor from "./MahjongPaiToHtmlConvertor.js";

import { DEFAULT_IMG_URL } from './constants.js';
import { SIZE } from './constants.js';
import { PARSE_RESULT } from './constants.js';

// these variables are being used as static classes, TODO if any better solution exsits
let mahjongTextParser = new MahjongTextParser();
let mahjongPaiToHtmlConvertor = new MahjongPaiToHtmlConvertor();

$(document).ready(function(e) {
  $("#convert").click(() => {
    let style = $("input[name=style]:checked").val();
    let checkedSizeOption = $("input[name=size]:checked").val();
    let customSize = $("#customSize>input").val();
    let hostUrl = DEFAULT_IMG_URL;

    let options = {
      style: style,
      checkedSizeOption: checkedSizeOption,
      customSize: customSize,
      hostUrl: hostUrl
    };

    let inputText = $("#inputText").val();
    
    saveLocalOptions(inputText, options);

    if (inputText) {
      let result = mahjongTextParser.parse(inputText);

      if (result.status === PARSE_RESULT.INVALID_INPUT) {
        $("#inputErrorLabel").css( {"display": "inline-block"});
        setShowArea("");
      } else {
        $("#inputErrorLabel").css("display", "none");

        let outputHtml = mahjongPaiToHtmlConvertor.convert(result.outputSet, options);
        setShowArea(outputHtml, result.paiCount);
      }
    } else {
      setShowArea("");
    }
  });

  $("#inputText").on("keydown", (e) => {
    if (e.which == 13) {
      $("#convert").click();
    }
  });

  $('input[type=radio][name=style]').change( () => {
    $("#convert").click();
  });

  $('input[type=radio][name=size]').change( () => {
    $("#customSizeErrorLabel").css({"display": "none"});

    if ($("input[name=size]:checked").val() == SIZE.CUSTOM) {
      $("#customSize").removeClass("disabled");
      $("#customSize>input").focus();
    } else {
      $("#convert").click();
      $("#customSize").addClass("disabled");
    }
  });

  $('#customSize>input').blur(() => {
    $("#convert").click();
  });

  $('#customSize>input').on("keydown", (e) => {
    if (e.which == 13) {
      $("#convert").click();
    }
  });

  $("#outputTextarea").on("click", function(){
    $(this)[0].select();
  });

  readLocalOptions();
  $("#convert").click();
});

function setShowArea(innerHtml, paiCount) {
  $("#show-area").html(innerHtml + ( paiCount ? "<div>(" + paiCount + "枚)</div>" : "" ));
  $("#outputTextarea").val(innerHtml);

  if (innerHtml && isMjDragon()) {
    $("#warning-area").css("display", "block")
    $("#warning-area").html("麻雀の雀龍.com様が提供した牌画を使用する際、下記のメッセージをサイトに載せてください。利用初めの一度だけでも結構です。<a href='http://www.mj-dragon.com/yaku/haiga.html' target='_blank'>麻雀の雀龍.com 麻雀牌画の利用規約</a><br/><br/>")
    $("#warning-area").append(document.createTextNode("※ 画像は<a href='http://www.mj-dragon.com/rule/''>麻雀ルール</a>解説でおなじみの「麻雀の雀龍.com」の無料麻雀牌画を利用しています。"));
  } else {
    $("#warning-area").css("display", "none")
    $("#warning-area").html("");
  }
}

function saveLocalOptions(inputText, options) {
  localStorage.setItem("inputText", inputText);
  localStorage.setItem("options", JSON.stringify(options));
}

function readLocalOptions() {
  $("#inputText").val(localStorage.getItem("inputText"));

  let optionsStr = localStorage.getItem("options");
  let options = JSON.parse(optionsStr);
  $("input[name=style][value=" + options.style + "]").prop('checked', true);
  $("input[name=size][value=" + options.checkedSizeOption + "]").prop('checked', true);
  $("#customSize>input").val(options.customSize);
}

function isMjDragon() {
  return $("input[name=style][value=0]").is(':checked');
}