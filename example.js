const bref = require('@sahirb/basketball-reference')

/*
    This is an example for
        1. Getting 3 days worth of NBA scores as JSON
        2. Saving that JSON as a text file
        3. Transforming the data to add a "feeling" property
            a. 'snooze fest'
            b. 'wow points and stuff in a blow out' if more than 220 points were scored (but score difference was greater than 10)
            c. 'be still my heart <4' if more than 220 points were scored & the score difference was less than 10
*/

const nba_season_end = {
    year: 2021,
    month: 10,
    day: 20
};
const num_additional_days = 1;

const local_file_path = "/Users/boghani/basketball-reference-js-box-score/data/box_scores/2021_2022/data.txt";

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

// bref.sortFileByGameDate(local_file_path);


// bref.getBoxScoresForDates(nba_season_end, num_additional_days, '', null).then(boxScores => {
//     boxScores.sort((a, b) => {
//         return new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime();
//     });

//     bref.appendCompactBoxScores(boxScores, local_file_path);
//     bref.sortFileByGameDate(local_file_path);
// });

// const lakersThunder = bref.getSeasonScoresSimple(2022, ['LA Lakers', 'Oklahoma City']);
// console.log(lakersThunder.length);
// console.log(lakersThunder[0]);

const sortedLakers = bref.getSeasonScores(2022)
.filter(boxScore => {
    return boxScore.roadTeam === 'LA Lakers' && boxScore.winningTeam !== 'LA Lakers';
}).sort((boxScoreA, boxScoreB) => {
    return boxScoreA.roadTeamTotal - boxScoreB.roadTeamTotal;
}).map(boxScore => {
    return {
        gameDate: boxScore.gameDate,
        roadTeamTotal: boxScore.roadTeamTotal,
    }
});

console.log(sortedLakers);
