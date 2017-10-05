module.exports = function TextAnalysis(input_text) {

  let stop_words =
    ['she', 'he', 'the', 'a', 'and', 'but', 'when', 'I', 'they'];
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

  this.getStops = () => { return stop_words; }
  this.setStops = (words) => { stop_words = words; return stops; }

  this.wordCount = () => { return tokens.length; }

  this.getFrequency = (word) => {
    return this.frequencies[word].count || 0;
  }

  this.wordsOverFrequency =  (limit=4) => {
    return Object.keys(this.frequencies)
      .filter( word => this.frequencies[word].count >= limit);
  }

}
