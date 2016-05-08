var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var book = [];

var printBook = function() {
  console.log("<h1>Table of Contents</h1>");
  book.forEach(function(item, index) {
    console.log('<a href="#chap#'+index+'">'+item.title+'</a><br>');
  });
  book.forEach(function(item, index) {
    console.log('<h1 id="chap#'+index+'">'+item.title+'</h1>'+item.content);
  });
}

var recursiveFetch = function(url) {
  request(url, function(error, response, html){
    if(error){
      console.log("error when fetching");
      process.exit(1);
    }

    var $ = cheerio.load(html);

    var title, release, rating;
    var json = { title : "", release : "", rating : ""};

    var chapter = $('h1.pjgm-posttitle').first();
    $('div.sharedaddy').remove()
    var content = $('div.pjgm-postcontent').first();


    book.push({
      title: chapter.text(),
      content: content.html().trim(),
    })

    var nextLink = $('div#pjgm-navbelow a[rel="next"]');
    if (nextLink.text().indexOf('→') !== -1) {
      recursiveFetch($(nextLink).attr('href'));
    } else {
      printBook()
    }

  })
}

recursiveFetch('http://unsongbook.com/prologue-2/')
