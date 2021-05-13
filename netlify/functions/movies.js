// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  // console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  // console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
// Return an error message if neither parameter is provided

  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Nope!` // a string of data
    }
  }

// If parameters are provided, create an array to be returned by the API

  else {
    let moviesToReturn = {
      numResults: 0,
      movies: []
    }


    // loop through all the movies

    for (let i=0; i < moviesFromCsv.length; i++) {

        // store each movie in memory from the CSV
        let film = moviesFromCsv[i]

        // check if the movie from the year and genre requested

        if (film.startYear == year && film.genres includes(genre) && film.genres !== `\\N` && film.runtimeMinutes !== `\\N`) {

          // Create a movie object containing the pertinent fields we want

          let Object = {
            title: film.primaryTitle,
            year: film.startYear,
            genres: film.genres,
            runtime: film.runtimeMinutes
          }
        
          // add the movie to the Array of movies to return
          moviesToReturn.movies.push(Object)
        }
    }

    // add the number of movies to the returned movies object

    moviesToReturn.numResults = moviesToReturn.movies.length

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(moviesToReturn) // a string of data returned
    }


  }
}