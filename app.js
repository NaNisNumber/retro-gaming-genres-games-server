const request = require("request");
const http = require("http");
let apiGenresData;

const gameOptionsReq = {
  url: "https://api.igdb.com/v4/games",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Client-ID": "vb838qqqsndwhxbu1gg98ljvtavacr",
    Authorization: "Bearer zkomcikvy6y3dqgffmw7osa8to49fm",
  },
  body: "fields summary,platforms.*,rating,first_release_date,genres.name,screenshots.*,name,cover.*;where cover!=null & themes != (42) & first_release_date <= 631152000 & rating != null;limit 400; ",
};

const gameGenresOptionsReq = {
  ...gameOptionsReq,
  url: "https://api.igdb.com/v4/genres",
  body: "fields name; limit 30;",
};

request(gameGenresOptionsReq, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    const parsedApiGenresData = JSON.parse(body);

    let genreNames = [];
    for (let i = 0; i < parsedApiGenresData.length; i++) {
      const genreName = parsedApiGenresData[i].name;
      genreNames.push(genreName);
    }
    genreNames.sort();

    apiGenresData = genreNames;
  }
});

const serverForSendingGameGenres = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify(apiGenresData));
});

serverForSendingGameGenres.listen(process.env.PORT || 5002, () => {});
