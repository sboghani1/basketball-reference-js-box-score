const bref = require('basketball-reference-js')

const last_game_date = {
    year: 2023,
    month: 11,
    day: 16
};
const num_days_lookback = 0;
const local_file_path = "/Users/boghani/basketball-reference-js-box-score/output_json.txt";
const box_score_transformation = (boxScore) => {
    let feeling = 'snooze fest';

    if (boxScore.gameTotal > 220) {
        feeling = 'wow points and stuff';

        if (boxScore.winningTeamScore - boxScore.losingTeamScore < 10) {
            feeling = 'be still my heart <4';
        }
    }

    boxScore.feeling = feeling;
};

bref.getBoxScoresForDates(last_game_date, num_days_lookback, local_file_path, box_score_transformation).then(boxScores => {
    boxScores.forEach(boxScore => console.log(boxScore));
});
