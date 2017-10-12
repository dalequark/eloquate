var TextAnalyzer = require('./src/textAnalyzer.js');
var assert = require('assert');

var text = "This is a test test string, where the most repeated " +
"words are test, string, and also repeated. But the shows up the " +
"a whole lot. Am I lying? the the the should be a stopword test test";

var info = new TextAnalyzer(text);

describe('analyzeText', function() {

  it('should not be null', function() { assert(info)} );

  it('should have nonzero length tokens', function() {
    info.tokens.forEach((token) => { assert(token.length > 0) });
  });

  describe('frequencies', function() {

    var freqs = info.frequencies;

    it('should not be null', function() { assert(freqs)});

    it('should make all word frequencies > 0', function() {
      for(word in freqs) {
        assert(freqs[word].count > 0, "Got count " +
        freqs[word].count + " for " + word);
      }
    });

    it('should not contain stopwords', function() {
      for(word in freqs) {
        assert(info.getStops().indexOf(word) == -1);
      }
    });

    it('should have word indices point to actual words', function() {
      for(word in freqs) {
        freqs[word]['indices'].forEach((index) => {
          assert(info.tokens[index] == word, "For word " + word +
          " at index " + index + " found word\t" + info.tokens[index]);
        });
      }
    });

    let repeat_distance = 8;

    describe('repeat distances', function() {
      var repeats = info.repeatsUnderDistance();

      it('should not be null', function() { assert(repeats); });

      it('should contain at least one entry', function() {
        assert(repeats.length > 0);
      });

      it('should have entries of [x,x]', function() {
        assert(repeats[0].length == 2);
      });

      it('should return positive indices less than length of text', function() {
        repeats.forEach((pairs) => {
          assert(pairs[0] >= 0 && pairs[0] < info.tokens.length,
          "First index: " + pairs[0]);

          assert(pairs[1] >= 1 && pairs[1] < info.tokens.length,
          "Second index: " + pairs[1]);
        });
      });

      it('should return pairs of the same word', function() {
        repeats.forEach((pairs) => {
          assert(info.tokens[pairs[0]] == info.tokens[pairs[1]],
          info.tokens[pairs[0]] + ", " + info.tokens[pairs[0]]);
        });
      });

      it('should return words less than or equal to ' + repeat_distance +
      ' words apart', function() {
        repeats.forEach((pairs) => {
          assert(pairs[1] - pairs[0] <= repeat_distance);
        });
      });

    });

  });

});
