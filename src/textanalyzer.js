import stop_words from './stopwords';

// Todo: why can't I export a static method?
export default function TextAnalysis(input_text) {

  let freq_dict = {};

  // Keep track of distance between last word usage
  let repeat_dists = {};

  // Regex delimter matches the one from Blast.js
  let tokens = input_text.split(/\s*(\S+)\s*/).filter((x) => { return x; });

  for(let i = 0; i < tokens.length; i++) {
    tokens[i] = tokens[i].toLowerCase();
  }


  tokens.forEach(function(word, word_index) {

    if(word.length < 1)  return;

    if(!freq_dict[word]) {
      freq_dict[word] = {'count' : 1, 'indices' : [word_index]};
      return;
    }

    let freq_info = freq_dict[word];

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
  this.stop_words = stop_words;

  this.frequencies = freq_dict;

  // Dictionary of distance_between_last_usage => index of all repeated words
  this.repeat_distances = repeat_dists;

  this.getStops = () => { return this.stop_words; }
  this.setStops = (words) => { this.stop_words = words; }
  this.isStop = (word) => { return this.stop_words.indexOf(word) >= 0; }

  this.wordCount = () => { return tokens.length; }

  this.wordAtIndex = (index) => { return tokens[index]; }

  this.wordsOverFrequency =  (limit = 4) => {
    return Object.keys(this.frequencies)
    .filter( (word) => {
      return this.frequencies[word].count >= limit && !this.isStop(word);
    });
  }

  this.getFrequency = (word) => { return this.frequencies[word].count || 0}

  this.getIndices = (word) => {
    return this.frequencies[word].indices || [];
  }

  // Returns indices of words repeated under distance
  this.repeatsUnderDistance = (min_distance = 10) => {
    let repeats = [];
    for(let i = 0; i < min_distance; i++) {
      if(!this.repeat_distances[i]) continue;
      this.repeat_distances[i].forEach((index) => {
        if(this.isStop(this.wordAtIndex(index)))  return;
        repeats.push([index - i, index]);
      });
    }
    return repeats;
  }

}

TextAnalysis.stop_words = stop_words;
