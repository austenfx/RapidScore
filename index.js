import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

let tournaments = [
    "premier-league",
    "champions-league",
    "europa-league",
    "europa-conference-league",
    "italian-serie-a",
    "spanish-la-liga",
    "german-bundesliga",
    "championship",
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
    let tournamentsWithMatches = await GetAllGamesOnDay(req.params.date);
    res.render("home.ejs", {tournamentsWithMatches: tournamentsWithMatches})
});

app.listen(port, () => {
    console.log("Server running on port " + port + ".");
});

async function GetAllGamesOnDay(date){
    let _tournaments = tournaments;
    let listOfTournamentsWithMatches = [];
    for (let i = 0; i < _tournaments.length; i++) {
        const tournament = tournaments[i];
        listOfTournamentsWithMatches.push(await GetAllTournamentGamesOnDay(tournament, date));
    }
    console.log(listOfTournamentsWithMatches);
    return listOfTournamentsWithMatches;
}

async function GetAllTournamentGamesOnDay(tournament, date){

    const result = await axios.get("https://push.api.bbci.co.uk/batch?t=/data/bbc-morph-sportsdata-soccer-fixture-list-tournament/date/" + date + "/tournament/" + tournament + "/version/2.2.3?timeout=5")
    const data = result.data;
    let matchesData = [];
    

    try {
        matchesData = data.payload[0].body.rounds[0].events;
    } catch (error) {
        //console.log(error);
    }

    let matches = [];
    for (let i = 0; i < matchesData.length; i++) {
        const match = matchesData[i];

        matches.push({
            homeTeam: match.homeTeam.name.abbreviation,
            awayTeam: match.awayTeam.name.abbreviation,
            score: [match.homeTeam.scores.score, match.awayTeam.scores.score]
        })
    }
    
    return {
        tournament: tournament,
        matches: matches
    };

    // 
}