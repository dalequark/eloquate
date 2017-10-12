import TextAnalysis from './textanalyzer';
import $ from 'jquery';
import blast from 'blast-text';
import _ from 'lodash';

const debounce = 1000;
const default_min_freq = 5;
const default_repeat_distance = 5;

let info;
let issue_queue = [];
let min_freq, repeat_distance;

update();

// Update the stop words list
updateStops(info.getStops());


/* ----- */

// update list of words or indices with class
function colorWords(words, class_name) {

  words.forEach((word) => {
    // if we're given a word, highlight by word. If number, highlight by
    // index
    let selector = typeof(word) == 'string' ? "#text_input .blast-word-" +
    CSS.escape(word) : '#text_input span:nth-child(' + (word + 1) + ')';
    $(selector).addClass(class_name);
  });

}

function updateStops(stops) {
  if(stops) $('#stop_words').text(stops.join(', '));
}

function updateUserParams() {
  min_freq = parseInt($('#min_freq')[0].innerText);
  repeat_distance = parseInt($('#repeat_distance')[0].innerText);

  if(!min_freq || min_freq < 0) {
    alert("# Repeats must be a number > 0!");
    min_freq = default_min_freq;
    $('#min_freq').text(min_freq);
  }
  if(!repeat_distance || repeat_distance < 0) {
    alert("# Repeats must be a number > 0!");
    repeat_distance = default_repeat_distance;
    $('#repeat_distance').text(repeat_distance);
  }
}

function runAnalysis() {
  let text = $('#text_input')[0].innerText;
  info = new TextAnalysis(text);
  let most_frequent = info.wordsOverFrequency(min_freq);

  // add frequency errors to the error queue
  issue_queue = _.map(most_frequent, (word) => {
    return {
      "message" : ("'" + word + "' was used " +
      info.getFrequency(word) + " times."),
      "indices" : info.getIndices(word)
    }
  });

  let too_close = info.repeatsUnderDistance(repeat_distance);

  // add frequency errors to the error queue
  issue_queue = issue_queue.concat(
    _.map(too_close, (indices) => {
      return {
        "message" : "Word '" +
        info.wordAtIndex(indices[0]) + "' was repeated " +
        (indices[1] - indices[0]) + " words away",
        "indices" : indices
      }
    })
  );
    console.log(issue_queue);
}

function updateView() {
  $('#text_input').blast({
    delimiter: 'word',
    generateValueClass: true,
    returnGenerated: false
  });

  // to do: don't calculate wordsOverFrequency twice, instead use a sort
  colorWords(_.flatten(info.repeatsUnderDistance(repeat_distance)), 'too_close');
  colorWords(info.wordsOverFrequency(min_freq), 'frequent');

  $('#word_count').text("Word Count: " + info.wordCount());

  $("#issue_queue").empty();
  issue_queue.forEach((issue) => {
    $("#issue_queue").append("<p class='issue'>" + issue['message'] + "</p>");
  });
}

function update() {

  // this must be called to get user-defined parameters
  updateUserParams();
  runAnalysis();
  updateView();

}

// Let the timeout wait for you to finish typing
let timeout;
$("#text_input").on("input", function() {
  clearTimeout(timeout);
  timeout = setTimeout(update, debounce);
});

// Also check for user-input parameters
$("#min_freq").on("input", function() {
  clearTimeout(timeout);
  timeout = setTimeout(update, 5000);
});

// Also check for user-input parameters
$("#repeat_distance").on("input", function() {
  clearTimeout(timeout);
  timeout = setTimeout(update, 5000);
});
