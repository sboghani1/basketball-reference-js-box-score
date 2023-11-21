const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

function httpGetWithRetry(url, currentAttempt, maxAttempts) {
    return new Promise((resolve, reject) => {
        axios.get(url)
        .then(response => {
            resolve(response);
        })
        .catch(error => {
            console.log(`Error fetching url ${url}: ${error.code} ${error.response.statusText}`)

            if (currentAttempt < maxAttempts) {
                console.log(`Looks like attempt ${currentAttempt} failed, will retry since it's not past the max attempts ${maxAttempts}`);

                httpGetWithRetry(url, currentAttempt + 1, maxAttempts);
            } else {
                console.log(`Looks like attempt ${currentAttempt} failed, cannot retry since it's past the max attempts ${maxAttempts}`);

                reject(error);
            }
        });
    });
}

// not configuring maxAttempts to save from hella 429 rate limit exceeded, but it works :) proof: iGot blocked
function httpGet(url, maxAttempts = 1) {
    return httpGetWithRetry(url, 1, maxAttempts);
}

function getBoxScoresForDate(date) {
    return new Promise((resolve, reject) => {
        httpGet(`https://www.basketball-reference.com/boxscores/?&year=${date.year}&month=${date.month}&day=${date.day}`)
        .then(response => {
            // use cheerio to parse HTML
            const $ = cheerio.load(response.data);
            const gameSummary = [];
            $('.game_summary')
            .each((index, element) => {
                const teamsDiv = $(element).find('.teams');
                const roadTeam = $(teamsDiv).find('tr:nth-child(1) td:nth-child(1) a:nth-child(1)').text();
                const homeTeam = $(teamsDiv).find('tr:nth-child(2) td:nth-child(1) a:nth-child(1)').text();

                const secondTable = $(element).find('table:nth-child(2)');
                const periodTotals = [];

                $(secondTable).find('.center').each((_scoreIndex, scoreElement) => {
                    const periodTotal = parseInt($(scoreElement).text());
                    periodTotals.push(periodTotal);
                });

                const numPeriods = periodTotals.length / 2;
                const periodBreakdown = [];
                for (let i = 0; i < numPeriods; ++i) {
                    periodBreakdown.push({
                        period: i + 1,
                        roadTotal: periodTotals[i]
                    });
                }
                for (let i = numPeriods, j = 0; i < periodTotals.length; ++i, ++j) {
                    periodBreakdown[j].homeTotal = periodTotals[i];
                }

                gameSummary.push({
                    gameDate: `${date.year}-${date.month}-${date.day}`,
                    numExtraPeriods: numPeriods - 4,
                    periodBreakdown,
                    roadTeam,
                    homeTeam
                });
            });

            resolve(gameSummary);
        })
        .catch(error => {
            reject(error);
        });
    });
}

function previousDay(current_date) {
    const next_date = new Date(`${current_date.year}-${current_date.month}-${current_date.day}`);
    next_date.setDate(next_date.getDate() - 1);

    return {
        year: next_date.getUTCFullYear(),
        month: next_date.getUTCMonth() + 1,
        day: next_date.getUTCDate()
    }
}

function getBoxScoresForDatesHelper(current_game_date, num_days_lookback, daily_scores, resolve, reject, file_path, box_score_transformation) {
    getBoxScoresForDate(current_game_date)
    .then(boxScores => {
        if (boxScores.length === 0) {
            const prev_game_date = previousDay(current_game_date);
            getBoxScoresForDatesHelper(prev_game_date, num_days_lookback - 1, daily_scores, resolve, reject, file_path, box_score_transformation);
        }

        if (boxScores.length > 0) {
            boxScores.forEach(bs => {
                let roadTeamTotal = 0;
                let homeTeamTotal = 0;

                bs.periodBreakdown.forEach(pb => {
                    roadTeamTotal += pb.roadTotal;
                    homeTeamTotal += pb.homeTotal;
                });


                bs.gameTotal = roadTeamTotal + homeTeamTotal;
                bs.roadTeamTotal = roadTeamTotal;
                bs.homeTeamTotal = homeTeamTotal;

                const homeWinner = homeTeamTotal > roadTeamTotal;
                bs.winningTeam = homeWinner ? bs.homeTeam : bs.roadTeam;
                bs.losingTeam = homeWinner ? bs.roadTeam : bs.homeTeam;
                bs.winningTeamScore = homeWinner ? homeTeamTotal : roadTeamTotal;
                bs.losingTeamScore = homeWinner ? roadTeamTotal : homeTeamTotal;

                if (box_score_transformation != null) {
                    box_score_transformation(bs);
                }
            });

            daily_scores.push(boxScores);

            if (num_days_lookback == 0) {
                if (file_path) {
                    fs.writeFileSync(file_path, JSON.stringify(daily_scores));
                }

                resolve(daily_scores);
            } else {
                const prev_game_date = previousDay(current_game_date);
                getBoxScoresForDatesHelper(prev_game_date, num_days_lookback - 1, daily_scores, resolve, reject, file_path, box_score_transformation);
            }
        }
    })
    .catch(error => {
        reject(error);
    });
}

function getBoxScoresForDates(last_game_date, num_days_lookback, file_path, box_score_transformation) {
    return new Promise((resolve, reject) => {
        getBoxScoresForDatesHelper(last_game_date, num_days_lookback, [], resolve, reject, file_path, box_score_transformation);
    });
}

function getBoxScores(date) {
    return getBoxScoresForDates(date, 0);
}

const bref = {}; // bref == basketball reference :)
bref.getBoxScores = getBoxScores;
bref.getBoxScoresForDates = getBoxScoresForDates;

module.exports = bref
