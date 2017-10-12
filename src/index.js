import TextAnalysis from './textanalyzer';
import $ from 'jquery';
import blast from 'blast-text';
import _ from 'lodash';


const min_freq = 2;

var info;
let issue_queue = [];
updateStats();

// Update the stop words list
updateStops(info.getStops());


/* ----- */

// update list of words or indices with color
function colorWords(words, color='red') {
  $('#text_input').blast({
    delimiter: 'word',
    generateValueClass: true,
    returnGenerated: false
  });
  words.forEach((word) => {
    // if we're given a word, highlight by word. If number, highlight by
    // index
    let selector = typeof(word) == 'string' ? "#text_input .blast-word-" +
    CSS.escape(word) : '#text_input span:nth-child(' + (word + 1) + ')';
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

  // add frequency errors to the error queue
  issue_queue = _.map(most_frequent, (word) => {
      return {
        "message" : ("Word '" + word + "' was used " +
        info.getFrequency(word) + " times."),
        "indices" : info.getIndices(word)
      }
    });

  let too_close = info.repeatsUnderDistance(3);

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

  // Update visuals

  let frequent_str = "";
  most_frequent.forEach(function(word) {
    frequent_str += "(\"" + word + "\", " +
    info.getFrequency(word) + ") ";
  });
  $("#most_frequent").text(frequent_str);
  colorWords(most_frequent);
  colorWords(_.flatten(too_close), 'blue');

  issue_queue.forEach((issue) => {
    $("#issue_queue").append("<p>" + issue['message'] + "</p>");
    console.log(issue['message']);
  });

}

// Let the timeout wait for you to finish typing
let timeout;
$("#text_input").on("input", function() {
  clearTimeout(timeout);
  timeout = setTimeout(updateStats, 1000);
});
