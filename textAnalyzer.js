var stop_words = ['she', 'he', 'the', 'a', 'and', 'but', 'when', 'I', 'they'];

function analyzeText(input_text) {
  var freq_dict = {};
  // Distance between this and last distance of this word
  var repeat_dists = [];
  var tokens = input_text.split(/\W+/);
  var word_index = 0;
  var freq_info;

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
      freq_dict[word] = {'count' : 1, 'indices' : [word_index], 'word': word};
      repeat_dists[word_index] = Infinity;
    }
    word_index++;
  });

  return {
    'frequencies': freq_dict,
    'repeat_distances': repeat_dists,
    'word_count' : tokens.length
  };
}


Object.filter = (obj, predicate) =>
    Object.keys(obj)
          .filter( key => predicate(obj[key]) )
          .reduce( (res, key) => (res[key] = obj[key], res), {} );

function getWordsOverFrequency(freqs, limit=4) {
  /* filter the frequency object for just those words
  above a given frequency. Return as an array */
  var words = Object.keys(freqs)
    .filter( word => freqs[word].count >= limit);
  var word_info = [];
  words.forEach(function(word) {
    word_info.push(freqs[word]);
  });
  console.log(word_info);
  return word_info;
}

function mostFrequent(freqs) {
  // print the most frequent word
  var most_frequent = {'count' : 0};
  for(word in freqs) {
    if(freqs[word].count > most_frequent.count) {
      most_frequent = freqs[word];
    }
  }
  return {'word': most_frequent['word'], 'count': most_frequent['count']};
}
