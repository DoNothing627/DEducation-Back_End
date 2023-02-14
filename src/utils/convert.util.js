const CONSTANTS = require("../constants");

const convertNumber = (number, pow = 8) => {
  number = Number(number);
  return Math.round(number * 10 ** pow) / 10 ** pow;
};

const plusMonth = (datetime, amount) => {
  datetime = new Date(datetime.getTime() + amount * 30 * 86400000).getTime();
  datetime += 86400000 - (datetime % 86400000);

  return new Date(datetime);
};

const getCurrentDate = (date) => {
  let time = new Date(date).getTime();
  time = time - (time % 86400000);
  // console.log(tmp)
  return time;
};

const convertDateMonth = (date) => {
  let time = new Date(date);
  // console.log(`time = `, time)
  let month = time.getUTCMonth();
  if (month < 10) {
    month = "0" + (month + 1);
  }
  let tmp = `${month}/01/${time.getUTCFullYear()}`;
  // console.log(tmp)
  return new Date(tmp);
};

const convertTransactionStatus = (status) => {
  let result;
  switch (status) {
    case CONSTANTS.Entity.TRANSACTION.STATUS.PENDING:
      result = "Pending";
      break;
    case CONSTANTS.Entity.TRANSACTION.STATUS.COMPLETED:
      result = "Completed";
      break;
    case CONSTANTS.Entity.TRANSACTION.STATUS.FAILED:
      result = "Failed";
      break;
    case "PC":
      result = "Processing";
      break;
    case CONSTANTS.Entity.TRANSACTION.STATUS.CANCELLED:
      result = "Cancalled";
      break;

    default:
      result = "Failed";
      break;
  }
  return result;
};

const showSeedNoForMatch = ({ matches, seed_teams = [], teamsInfo }) => {
  try {
    // console.log(`matches`, matches)
    // console.log(`seed_teams`, seed_teams)
    seed_teams = JSON.parse(JSON.stringify(seed_teams ?? []));
    let results = JSON.parse(JSON.stringify(matches ?? []));
    matches.map((match, i) => {
      if (match.team1) {
        let seed_no = seed_teams.indexOf(match.team1._id.toString());
        if (seed_no >= 0) {
          // console.log(results[i].team1)
          results[i].team1.seed_no = seed_no + 1;
          // console.log(results[i].team1)
        }
      }
      if (match.team2) {
        let seed_no = seed_teams.indexOf(match.team2._id.toString());
        if (seed_no >= 0) {
          // console.log(results[i].team1)
          results[i].team2.seed_no = seed_no + 1;
          // console.log(results[i].team1)
        }
      }
    });
    // console.log(`results`, results)

    return results;
  } catch (error) {
    throw error;
  }
};

const showSeedNoForMatchDE = ({
  matches,
  upper_seedTeams = [],
  lower_seedTeams = [],
  teamsInfo,
}) => {
  try {
    // console.log(`matches`, matches)
    // console.log(`seed_teams`, seed_teams)
    upper_seedTeams = JSON.parse(JSON.stringify(upper_seedTeams ?? []));
    lower_seedTeams = JSON.parse(JSON.stringify(lower_seedTeams ?? []));

    let results = JSON.parse(JSON.stringify(matches ?? []));
    matches.map((match, i) => {
      if (match.team1) {
        let seed_no = upper_seedTeams.indexOf(match.team1._id.toString());
        if (seed_no >= 0) {
          // console.log(results[i].team1)
          results[i].team1.seed_no = seed_no + 1;
          // console.log(results[i].team1)
        } else {
          seed_no = lower_seedTeams.indexOf(match.team1._id.toString());
          if (seed_no >= 0) {
            // console.log(results[i].team1)
            results[i].team1.seed_no = seed_no + 1;
            // console.log(results[i].team1)
          }
        }
      }
      if (match.team2) {
        let seed_no = upper_seedTeams.indexOf(match.team2._id.toString());
        if (seed_no >= 0) {
          // console.log(results[i].team1)
          results[i].team2.seed_no = seed_no + 1;
          // console.log(results[i].team1)
        } else {
          seed_no = lower_seedTeams.indexOf(match.team2._id.toString());
          if (seed_no >= 0) {
            // console.log(results[i].team1)
            results[i].team2.seed_no = seed_no + 1;
            // console.log(results[i].team1)
          }
        }
      }
    });
    // console.log(`results`, results)

    return results;
  } catch (error) {
    throw error;
  }
};
const showSeedNoForMatchBr = ({ matches, seed_teams = [] }) => {
  try {
    // console.log(`matches`, matches)
    seed_teams = JSON.parse(JSON.stringify(seed_teams ?? []));
    let results = [];
    matches.map((match, i) => {
      let teams_tmp = {};
      match.teams.map((team, j) => {
        let seed_no = seed_teams.indexOf(team._id.toString());
        if (seed_no >= 0) {
          matches[i].teams[j] = {
            ...matches[i].teams[j]._doc,
            seed_no: seed_no + 1,
          };
        }
        teams_tmp[`${team._id}`] = matches[i].teams[j];
      });
      //update scores
      let scores = [];
      match.scores.map((score) => {
        scores.push({
          ...score._doc,
          team_info: teams_tmp[`${score._doc.team}`],
        });
      });
      results[i] = {
        scores: scores,
        _id: matches[i]._id,
        index: matches[i].index,
        round_index: matches[i].round_index,
        game: matches[i].game,
        round: matches[i].round,
        bracket: matches[i].bracket,
        tournament: matches[i].tournament,
        time: matches[i].time,
        status: matches[i].status,
      };
    });

    // console.log(JSON.stringify(results))
    return results;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  convertNumber,
  getCurrentDate,
  convertTransactionStatus,
  plusMonth,
  convertDateMonth,
  showSeedNoForMatchBr,
  showSeedNoForMatch,
  showSeedNoForMatchDE,
};
