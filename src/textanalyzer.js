module.exports = function TextAnalysis(input_text) {

  let stop_words =
  ['she', 'he', 'the', 'a', 'and', 'but', 'when', 'I', 'they'];
  let freq_dict = {};

  // Keep track of distance between last word usage
  let repeat_dists = {};

  // Regex delimter matches the one from Blast.js
  let tokens = input_text.split(/\s*(\S+)\s*/).filter((x) => { return x; });

  for(let i = 0; i < tokens.length; i++) {
    tokens[i] = tokens[i].toLowerCase();
  }


  tokens.forEach(function(word, word_index) {

    if(stop_words.indexOf(word) >= 0 || word.length < 1)  return;

    if(!freq_dict[word]) {
      freq_dict[word] = {'count' : 1, 'indices' : [word_index]};
      return;
    }

    freq_info = freq_dict[word];

    freq_info['count'] += 1;

    // Positions of this word
    let last_index = freq_info['indices'][freq_info['indices'].length - 1];
    freq_info['indices'].push(word_index);

    // map distance (as key) to index of word

    let word_distance = word_index - last_index;
    if(repeat_dists[word_distance]) {
      repeat_dists[word_distance].push(word_index);
    } else {
      repeat_dists[word_distance] = [word_index];
    }

  });


  /* ------------------------------------------------------------------------*/

  this.tokens = tokens;

  this.frequencies = freq_dict;

  // Dictionary of distance_between_last_usage => index of all repeated words
  this.repeat_distances = repeat_dists;

  this.getStops = () => { return stop_words; }
  this.setStops = (words) => { stop_words = words; return stops; }

  this.wordCount = () => { return tokens.length; }

  this.getFrequency = (word) => {
    return this.frequencies[word].count || 0;
  }

  this.wordsOverFrequency =  (limit = 4) => {
    return Object.keys(this.frequencies)
    .filter( word => this.frequencies[word].count >= limit);
  }

  // Returns indices of words repeated under distance
  this.repeatsUnderDistance = (min_distance = 10) => {
    let repeats = [];
    for(let i = 0; i < min_distance; i++) {
      if(!this.repeat_distances[i]) continue;
      this.repeat_distances[i].forEach((index) => {
        repeats.push([index - i, index]);
      });
    }
    return repeats;
  }

}
