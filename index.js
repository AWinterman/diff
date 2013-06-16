var levelup = require('levelup')
  , assert = require("assert")
  , EE = require("events")

// attribution where it is due. This is a port of the algorithm to javascript based on a c# file:
// I need to make sure that I can relicense under MIT.

  // diff.cs: A port of the algorythm to C#
  // Copyright (c) by Matthias Hertel, http://www.mathertel.de
  // This work is licensed under a BSD style license. See http://www.mathertel.de/License.aspx

// TODO learn about and use buffers
// a function that takes 2 text documents, compares by line, and returns an
// array of items describing the differences.

// takes two params, A, and B, the old and new documents

function diff(A, B, trimSpace, ignoreCase, ready){
  // h is a hashtable for the texts in question. It is going to have an element
  // for each word in A and each word in B
  var trimSpace = !!trimSpace
    , ignoreCase = !!trimSpace
  
  // h may provide a good opportunity to make use of levelup/leveldb.
  var h = levelup("./data_hash")
    , aggregate_emitter = new EE
    , emitterA = new EE
    , emitterB = new EE
    , lastUSedCode
    , dataA = false
    , dataB = false

  diffcodes(A, h, trimSpace, ignoreCase)
  diffcodes(B, h, trimSpace, ignoreCase)
  h.on("put", function(key, value){
    lastUsedCode = value
  })

  emitterA.on("code", function(codes) {
    readyA = true      
    this.emit('data', new DiffData(codes))
    (dataA && dataB) && createDifs(dataA, dataB)
  })

  emitterB.on("code", function(codes) {
    readyB = true
    this.emit("data", new DiffData(codes))
    (dataA && dataB) && createDifs(dataA, dataB)
  })

  function createDiffs(dataA, dataB) {
    var max = dataA.length + dataB.length + 1
      , downvector = new Array(2 * max + 2)
      , upvector = new Array(2 * max + 2)
    lcs(dataA, 0, dataB, 0, downvector, upvector)
    optimize(dataA)
    optimize(dataB)

    ready(creatediffs(dataA, dataB))
  }
  
  // hashes textlines to number for ease of references
  function diffcodes(text, emmitter, h, trimSpace, ignoreCase) {
    var lines
      , codes

    text = text.replace("\r", "")
    lines = text.split("\n", "")

    codes = new Array(lines.length)

    encode(lines)

    // basically for each line, try to read it out of the db. If you fail, then
    // write it to the db instead. 

    // the wrinkle is that I'm using leveldb-- writes and reads are async,
    // hence the recursive function below which will wait for the async operation to
    // finish before firing the next one in the series.

    // this wont be faster than using regular old js objects, but it does have some nice properties.

    function encode(lines) {
      var ready = true

      if (lines.length = 0) {
        emitter.emit("codes", codes)
        return
      }

      var s = lines.unshift()

      if (trimSpace) {
        s.trim()
      }
      
      if (ignoreCase) {
        s = s.toLowerCase()
      }

      h.get(s, {}, function(error, data){
        // will return an error if the key does not exist
        if (err){
          h.put(s, lastUsedCode, function(err, dat){
            console.log(data) // what the hell is this going to be?
            assert.ok(!err, "There was an error writing to the DB \n" + err)
            codes[i] = lastUsedCode
            encode(lines)
          })
        } else {
          codes[i] = data
          encode(lines)
        }
      })
    }
  }


  // If a sequence of modified lines starts with a line that contains the same content
  // as the line that appends the changes, the difference sequence is modified so that the
  // appended line and not the starting line is marked as modified.
  // This leads to more readable diff sequences when comparing text files.

  // arguments:  
  // `data` : a DiffData object

  // side-effects:
  // modifies the `data` method in place.

  // returns: 
  // undefined
  function optimize(data) {
    var start_position, end_position

    start_position = 0
    while (start_position < data.length) {
      while ((start_position < data.length) && (data.modified[start_position] == false))
        start_position++;
      end_position = start_position;
      while ((end_position < data.length) && (data.modified[end_position] == true))
        end_position++;
      if ((end_position < data.length) && (data.data[start_position] == data.data[end_position])) {
        data.modified[start_position] = false;
        data.modified[end_position] = true;
      } else {
        start_position = end_position;
      } // if
    } // while
  }
}


// initData is an array of integers
function DiffData(initData) {
  var length = initData.length
    , data = initData
    , modified = [false]
  modified.length = length + 2

  for (var i = 0; i < length + 2; ++i) {
    modified[i] = false
  }

  this.data = data  
  this.modified = modified
  this.length = length
}


