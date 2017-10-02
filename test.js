var ta = require('./textAnalyzer.js');
var assert = require('assert');

var text = "This is a test test string, where the most repeated " +
"words are test, string, and also repeated. But the shows up the " +
"a whole lot. Am I lying? the the the should be a stopword test test";

var info = ta.analyzeText(text);

describe('analyzeText', function() {

  it('should not be null', function() { assert(info)} );

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
        assert(ta.stop_words.indexOf(word) == -1);
      }
    });

  });

  describe('repeat_distances', function() {
    it('should not be null', function() { assert(info.repeat_distances)});
  });

});

describe('mostFrequent', function() {
  var res = ta.mostFrequent(info);

  it('it should be "test"', function() {
      assert(res.word == 'test', res.word);
  });

  it('should have count 5', function() {
    assert(res.count == 5, res.count);
  });

});
