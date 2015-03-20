var request = require('request');
var lda = require('lda');

function parseDescription(description) {
  return description.match( /[^\.!\?]+[\.!\?]+/g);
}

function printTopics(result) {
  // For each topic.
  for (var i in result) {
    var row = result[i];
    console.log('Topic ' + (parseInt(i) + 1));

    // For each term.
    for (var j in row) {
      var term = row[j];
      console.log(term.term + ' (' + term.probability + '%)');
    }

    console.log('');
  }
}

function getTopics(repositories) {
  repositories.map(function(repository) {
    console.log(repository.name + ' ' + repository.url);
    console.log(repository.description);
    console.log('Topics>>');
    var documents = parseDescription(repository.description) || repository.description.split(',');
    printTopics(lda(documents, 1, 5));
  });
}

function processRepositoriesDescriptions(starred) {
  starred = starred
    .map(function(repository) {
      return repository;
    })
    .filter(function(repository) {
      return repository.description !== '';
    });

    getTopics(starred);
}

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var starredRepositories = JSON.parse(body);
    processRepositoriesDescriptions(starredRepositories);
  }
}

var options = {
  url: 'https://api.github.com/users/eabait/starred',
  headers: {
    'User-Agent': 'eabait'
  }
};

request(options, callback);