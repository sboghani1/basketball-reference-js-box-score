const bref = require('basketball-reference-js')

/*
    This is an example for
        1. Getting 3 days worth of NBA scores as JSON
        2. Saving that JSON as a text file
        3. Transforming the data to add a "feeling" property
            a. 'snooze fest'
            b. 'wow points and stuff in a blow out' if more than 220 points were scored (but score difference was greater than 10)
            c. 'be still my heart <4' if more than 220 points were scored & the score difference was less than 10
*/

const last_game_date = {
    year: 2023,
    month: 11,
    day: 16
};
const num_additional_days = 2;
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

bref.getBoxScoresForDates(last_game_date, num_additional_days, local_file_path, box_score_transformation).then(boxScores => {
    boxScores.forEach(boxScore => console.log(boxScore));
});
