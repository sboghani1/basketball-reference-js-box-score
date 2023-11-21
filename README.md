# basketball-reference [docmentation in progress]

Install:
```
npm i @sahirb/basketball-reference
```

Data Model
```
BoxScore: {
    gameDate: string,
    numExtraPeriods: number,
    roadTeam: string,
    homeTeam: string,
    gameTotal: number,
    roadTeamTotal: number,
    homeTeamTotal: number,
    winningTeam: string,
    losingTeam: string,
    winningTeamScore: number,
    losingTeamScore: number,
    periodBreakdown: PeriodBreakdown
}
```

Functions
```
getBoxScores(date) => Promise<[]BoxScore>

date: {
    year: number,
    month: number,
    day: number
}
```
```
getBoxScoresForDates(last_game_date, num_additional_days, file_path, box_score_transformation) => Promise<[]BoxScore>

last_game_date: {
    year: number,
    month: number,
    day: number
}

num_additional_days: number

file_path?: string

box_score_transformation?: (BoxScore) => void
```

Example Simple
```
const bref = require('basketball-reference-js')

const date = {
    year: 2023,
    month: 11,
    day: 16
};

bref.getBoxScores(date).then(boxScores => {
    boxScores.forEach(boxScore => console.log(boxScore));
});

```

Example Advanced (save to file with new 'feeling' column)
```
const bref = require('basketball-reference-js')

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

```
