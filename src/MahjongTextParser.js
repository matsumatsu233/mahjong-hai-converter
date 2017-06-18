import { PARSE_RESULT } from './constants.js';

export default class MahjongTextParser {
  parse(inputText) {
    let inputTextBlock = inputText.replace(/\s+/g,' ').split('|');
    let outputSet = [];
    try {
      inputTextBlock.forEach((input) => {
        let inputTextBlock = input.trim();
        let blockParseResult = this.parseOneBlock(inputTextBlock);
        if (blockParseResult.status === PARSE_RESULT.SUCCESS) {
          outputSet = outputSet.concat(blockParseResult.outputSet);
          outputSet.push("|");
        } else {
          throw "Invalid input";
        }
      });
    } catch (e) {
      return {
        status: PARSE_RESULT.INVALID_INPUT,
      }
    }
    outputSet.pop();
    let newOutputSet = outputSet.filter((e) => (!this.isSpace(e) && e !== "|"));
    return {
      status: PARSE_RESULT.SUCCESS,
      outputSet: outputSet,
      paiCount: this.getPaiCount(outputSet)
    };
  }

  parseOneBlock(inputText) {
    let status = 0;
    let pos = 0;
    let prePai = {};
    let prePaiStack = [];
    let outputSet = [];
    while (pos < inputText.length) {
      let char = inputText.charAt(pos);
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
              status: PARSE_RESULT.INVALID_INPUT
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
          }  else if (this.isRotation(char)) {
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
            let symbol = char;
            try {
              prePaiStack.forEach( (prePai) => {
                if (this.isInvalidCombination(prePai.number, symbol)) {
                  throw "Invalide combination";
                }

                let pai = prePai.number + symbol;
                if (prePai.prefix) {
                  pai = prePai.prefix + pai;
                }
                outputSet.push(pai);
              });
            } catch (e) {
              return {
                status: PARSE_RESULT.INVALID_INPUT
              };
            }
            prePaiStack = [];
            pos++;
            status = 0;
          } else {
            return {
              status: PARSE_RESULT.INVALID_INPUT
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
            status: PARSE_RESULT.INVALID_INPUT
            };
          }
          break;
        case 3:
          if (this.isNumber(char) && char === inputText.charAt(pos+1)) {
            prePai.number = char;
            prePaiStack.push(prePai);
            prePai = {};
            status = 1;
            pos += 2;
          } else {
            return {
              status: PARSE_RESULT.INVALID_INPUT
            };
          }
          break;
        default:
          return {
            status: PARSE_RESULT.INVALID_INPUT
          };
      }
    }

    //console.log("outputSet", outputSet);
    // when input text doesn't end with a symbol
    if (prePaiStack.length !== 0) {
      return {
        status: PARSE_RESULT.INVALID_INPUT
      };
    } else {
      return {
        status: PARSE_RESULT.SUCCESS,
        outputSet: outputSet
      };
    }
  }

  isNumber(char) {
    return /^[0-9]$/.test(char);
  }

  isSpace(char) {
    return char === " ";
  }

  isRotation(char) {
    return char === "l" || char === "r" || char === "b";
  }

  isKan(char) {
    return char === "L" || char ==="R";
  }

  isSymbol(char) {
    return (char === "m") || (char === "p") || (char === "s") || (char === "z");
  }

  isInvalidCombination(pai) {
    return (pai === "0z") || (pai === "8z") || (pai === "9z");
  }

  getPaiCount(outputSet) {
    return outputSet.filter((e) => (!this.isSpace(e) && e !== "|")).length + outputSet.filter((e) => this.isKan(e[0])).length
  }
}