<<<<<<< HEAD
Package moved [@sahir/nba-stats](https://www.npmjs.com/package/@sahirb/nba-stats). For latest, run

=======
Hoping to make NBA data more accessible for other fanatics! 🤗

There are two types of APIs (NBA Data, Parse basketball-reference)

# i. NBA Data 🏀 🧬

Current Data:
- Box Scores
  - 2018-2023 (5 seasons)

Possible Future Data:
- More seasons
- Player Stats
- Team/Game Stats

If we want the game total & q2 difference for 2022 Lakers road losses (sorted by game total):
```javascript
const sortedLakers = bref.getSeasonScores(2022)
.filter(boxScore => {
    return
        boxScore.roadTeam === 'LA Lakers' &&
        boxScore.winningTeam !== 'LA Lakers';
}).sort((boxScoreA, boxScoreB) => {
    return
        boxScoreA.roadTeamTotal - boxScoreB.roadTeamTotal;
}).map(boxScore => {
    return {
        gameDate: boxScore.gameDate,
        roadTeamTotal: boxScore.roadTeamTotal,
        roatTeamSecondQuarter: boxScore.periodBreakdown[1].roadTotal
    }
});

console.log(sortedLakers);

// -- result --
[
  { date: '2022-12-28', total: 98, diff: -14, q2Diff: -1 },
  { date: '2022-10-26', total: 99, diff: -11, q2Diff: 4 },
  { date: '2022-11-9', total: 101, diff: -13, q2Diff: 15 },
  { date: '2022-10-28', total: 102, diff: -9, q2Diff: 3 },
  { date: '2022-12-6', total: 102, diff: -14, q2Diff: -7 },
  { date: '2022-12-19', total: 104, diff: -26, q2Diff: -10 },
  { date: '2023-1-30', total: 104, diff: -17, q2Diff: 1 },
  { date: '2022-11-22', total: 105, diff: -10, q2Diff: 6 },
  { date: '2022-10-18', total: 109, diff: -14, q2Diff: -4 },
  { date: '2023-1-9', total: 109, diff: -13, q2Diff: -8 },
  { date: '2023-2-28', total: 109, diff: -12, q2Diff: 7 },
  { date: '2023-3-15', total: 110, diff: -4, q2Diff: -2 },
  { date: '2022-12-7', total: 113, diff: -13, q2Diff: -15 },
  { date: '2022-12-25', total: 115, diff: -9, q2Diff: 4 },
  { date: '2023-2-13', total: 115, diff: -12, q2Diff: -4 },
  { date: '2022-11-7', total: 116, diff: -23, q2Diff: 3 },
  { date: '2023-4-5', total: 118, diff: -7, q2Diff: -13 },
  { date: '2022-12-21', total: 120, diff: -14, q2Diff: -9 },
  { date: '2023-1-28', total: 121, diff: -4, q2Diff: 7 },
  { date: '2022-12-9', total: 122, diff: -11, q2Diff: 9 },
  { date: '2023-2-4', total: 126, diff: -5, q2Diff: 9 }
]
```

To get all scores for one/more teams:
```javascript
const lakersThunder = bref.getSeasonScoresSimple(2022, ['LA Lakers', 'Oklahoma City']);

console.log(lakersThunder.length);
console.log(lakersThunder[0]);

// -- result --
160
{
  gameDate: '2021-10-19',
  roadTeam: 'Golden State',
  homeTeam: 'LA Lakers',
  ...
  winningTeamScore: 121,
  losingTeamScore: 114
}
```

Data Model
>>>>>>> 10c2f6b1ef748a5b8560bf2926fd47fb29310bea
```javascript
npm install @sahirb/nba-stats
```
