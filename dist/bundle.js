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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__textanalyzer__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__textanalyzer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__textanalyzer__);


// From https://codepen.io/vsync/pen/frudD
// Applied globally on all textareas with the "autoExpand" class
$(document)
.one('focus.autoExpand', 'textarea.autoExpand', function(){
  let savedValue = this.value;
  this.value = '';
  this.baseScrollHeight = this.scrollHeight;
  this.value = savedValue;
})
.on('input.autoExpand', 'textarea.autoExpand', function(){
  let minRows = this.getAttribute('data-min-rows')|0, rows;
  this.rows = minRows;
  rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
  this.rows = minRows + rows;
});

// Update the stop words list
updateStops();


const min_freq = 2;

/* ----- */

// update list of words with color red
function colorWords(words, color='red') {
  $('#text_input').blast({
    delimiter: 'word',
    generateValueClass: true,
    returnGenerated: false
  });
  words.forEach((word) => {
    let selector = "#text_input .blast-word-" + CSS.escape(word);
    $(selector).css('color', color);
  });

}

function updateStops() {
  $('#stop_words').text(stop_words.join(', '));
}

function updateStats() {

  let text = $('#text_input')[0].innerText;
  let info = __WEBPACK_IMPORTED_MODULE_0__textanalyzer___default()(text);

  $('#word_count').text("Word Count: " + info.wordCount());

  let most_frequent = info.wordsOverFrequency(min_freq);
  let frequent_str = "";
  most_frequent.forEach(function(word_info) {
    frequent_str += "(\"" + word_info.word + "\", " + word_info.count + ") ";
  });

  $("#most_frequent").text(frequent_str);

  colorWords(most_frequent);

}

// Let the timeout wait for you to finish typing
let timeout;
$("#text_input").on("input", function() {
  clearTimeout(timeout);
  timeout = setTimeout(updateStats, 1000);
});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

let stop_words = ['she', 'he', 'the', 'a', 'and', 'but', 'when', 'I', 'they'];

module.exports.TextAnalysis = function TextAnalysis(input_text) {

  let freq_dict = {};

  // Distance between this and last distance of this word
  let repeat_dists = [];

  // Regex delimter matches the one from Blast.js
  let tokens = input_text.split(/\s*(\S+)\s*/);
  let word_index = 0;
  let freq_info;

  tokens.forEach( (word) => {
    word = word.toLowerCase();

    if(stop_words.indexOf(word) >= 0 || word.length < 1)  return;

    freq_info = freq_dict[word];
    if(freq_info) {
      freq_info['count'] += 1;

      // Positions of this word
      freq_info['indices'].push(word_index);

      repeat_dists[word_index] = word_index - freq_info[freq_info.length - 1];
    }
    else {
      freq_dict[word] = {'count' : 1, 'indices' : [word_index]};
      repeat_dists[word_index] = Infinity;
    }
    word_index++;
  });

  this.frequencies = freq_dict;
  this.repeat_distances = repeat_dists;

  this.wordCount = () => { return tokens.length(); }

  this.getFrequency = (word) => { return frequencies[word].count; }

  this.wordsOverFrequency =  (limit=4) => {
    return Object.keys(frequencies)
      .filter( word => frequencies[word].count >= limit);
  }

}


/***/ })
/******/ ]);