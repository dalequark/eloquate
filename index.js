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

$('textarea').change(function() {
  console.log("updating stats...");
  updateStats();
});

updateStops();

function updateStops() {
    $('#stop_words').text(stop_words.join(', '));
}

function colorWords(indices, colors) {
  $('textarea').blast({
    delimiter: 'word',
    generateIndexID: true
  });
  $("p").blast({ delimiter: "word" });
}

function updateStats() {
  var text = $('textarea').val();
  var info = analyzeText(text);
  var frequencies = info.frequencies;
  var repeat_distances = info.repeat_distances;
  var top_word = mostFrequent(frequencies);
  $('#word_count').text("Word Count: " + info.word_count);

  var most_frequent = getWordsOverFrequency(frequencies);
  var frequent_str = "";
  most_frequent.forEach(function(word_info) {
    frequent_str += "(\"" + word_info.word + "\", " + word_info.count + ") ";
  });
  $("#most_frequent").text(frequent_str);
  colorWords();
}
