// From https://codepen.io/vsync/pen/frudD
// Applied globally on all textareas with the "autoExpand" class
$(document)
    .one('focus.autoExpand', 'textarea.autoExpand', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', 'textarea.autoExpand', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
        this.rows = minRows + rows;
    });

updateStops();

function updateStops() {
    $('#stop_words').text(stop_words.join(', '));
}

function colorWords(words, color='red') {
  $('#text_input').blast({
    delimiter: 'word',
    generateIndexID: true,
    generateValueClass: true,
    returnGenerated: false
  });

  console.log(words);

  for(word in words) {
    var selector = "#text_input .blast blast-word-" + word;
    $(selector).css('color', color);
  }
}

const min_freq = 2;

function updateStats() {

  var text = $('#text_input')[0].innerText;
  var info = analyzeText(text);
  var frequencies = info.frequencies;
  var repeat_distances = info.repeat_distances;
  var top_word = mostFrequent(frequencies);
  $('#word_count').text("Word Count: " + info.word_count);

  var most_frequent = getWordsOverFrequency(frequencies, min_freq);

  var frequent_str = "";
  most_frequent.forEach(function(word_info) {
    frequent_str += "(\"" + word_info.word + "\", " + word_info.count + ") ";
  });

  $("#most_frequent").text(frequent_str);

  colorWords(frequencies.keys);

}

// Let the timeout wait for you to finish typing
var timeout;
$("#text_input").on("input", function() {
  clearTimeout(timeout);
  timeout = setTimeout(updateStats, 1000);
});
