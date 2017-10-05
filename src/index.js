import TextAnalysis from './textanalyzer';
import $ from 'jquery';
import blast from 'blast-text';
//import * as $ from 'blast-text';


const min_freq = 2;


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

var info;
updateStats();

// Update the stop words list
updateStops(info.getStops());



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

function updateStops(stops) {
  if(stops) $('#stop_words').text(stops.join(', '));
}

function updateStats() {

  let text = $('#text_input')[0].innerText;
  info = new TextAnalysis(text);

  $('#word_count').text("Word Count: " + info.wordCount());

  let most_frequent = info.wordsOverFrequency(min_freq);
  let frequent_str = "";
  most_frequent.forEach(function(word) {
    frequent_str += "(\"" + word + "\", " +
    info.getFrequency(word) + ") ";
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
