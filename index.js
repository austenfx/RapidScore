import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

let leagues = [
    "premier-league",
    "championship",
    "italian-serie-a",
    "spanish-la-liga",
    "german-bundesliga",
    "french-ligue-1",
    "league-one",
    "league-two",
    "national-league"
]

app.get("/", (req, res) => {
    let date = (new Date().toISOString().split("T")[0]);
    res.redirect("/games/" + date);
});

app.get("/games/:date", async (req, res) => {
    let results = await GetAllGamesOnDay(req.params.date);
    res.send(results.join("<br/>"));
});

app.get("/api/fixtures/", (req, res) => {
    
});

app.listen(port, () => {
    console.log("Server running on port " + port + ".");
});

async function GetAllGamesOnDay(date){
    return await GetAllLeagueGamesOnDay(date);
}

async function GetAllLeagueGamesOnDay(date){
    let results = [];
    for (let i = 0; i < leagues.length; i++) {
        const league = leagues[i];
        
        const result = await axios.get("https://push.api.bbci.co.uk/batch?t=/data/bbc-morph-sportsdata-soccer-fixture-list-tournament/date/" + date + "/tournament/" + league + "/version/2.2.3?timeout=5")
        const data = result.data;
        let games = [];
        try {
            games = Object.values(data.payload[0].body.rounds[0].events);
            //console.log(league, games);
            for (let gameIndex = 0; gameIndex < games.length; gameIndex++) {
                const game = games[gameIndex];
                let gameScore = game.homeTeam.name.abbreviation + " " + game.homeTeam.scores.fullTime + " v " + game.awayTeam.scores.fullTime + " " + game.awayTeam.name.abbreviation;
                results.push(gameScore);
            }
        } catch (error) {
            console.log(error);
        }
        console.log(results.length);
    }
    return results;
}