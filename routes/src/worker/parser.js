var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// Req Variable
let xhr = new XMLHttpRequest();
// Log variables
let log = require('../../libs/winston')(module);
// Data for parse
const abbData = require('../data/abbData');
const fullNames = require('../data/fullName');
// Correlator for BK
const CORRELATOR = {
  id3: 7, //  Sbobet
  id4: 5, //  Marathon
  id6: 2, //  Fonbet
  id10: 0, //  Bet365
  id21: 4, //  1XBET
  id27: 1, // Olimp
  id30: 3, // Leon
  id11: 6 // 888sport <CHECK IT LATER *BOOKMAKER_CLONE* HUY EGO ZNAET>
}
// BK req URLS
const FILTER_1_ID = "334309";
const FILTER_2_ID = "334310";
const FILTER_3_ID = "334311";
const FILTER_4_ID = "329510";
const FILTER_5_ID = "329514";
const FILTER_6_ID = "329519";
const FILTER_7_ID = "329522";
const FILTER_8_ID = "329524";
// Bet lists for each bk
let req_bk_data = [
[], // bet365
[], // olimp
[], // fonbet
[], // leon
[], // 1xbet
[], // marathon
[], // 888sport
[] // sbobet
];
// BK states
let filter_1_state = false;
let filter_2_state = false;
let filter_3_state = false;
let filter_4_state = false;
let filter_5_state = false;
let filter_6_state = false;
let filter_7_state = false;
let filter_8_state = false;
// Amount of the active bookmakers
let actives = 0;
// ABB access token
let access_token;
// Work state variable
let workState = false;
// Dictionary of bets which must be excluded
let toExclude = [];
// Active spread for the requests
let REQQue = [];
// exclude state
let excludeState = false;
// Delay between requests
let delay = 6000;
let turnCount = 0;

function mainFunc() {
  log.info(`WS:${workState}|AC:${actives}`);
  if (workState && actives > 0) {
    let resList;
    let result;
    let bk;
    if (filter_1_state && turnCount == 0) {
      resList = reqFunc(FILTER_1_ID);
      bk = turnCount;
      excludeState = false;
    } else if (filter_2_state && turnCount == 2) {
      resList = reqFunc(FILTER_2_ID);
      bk = turnCount;
      excludeState = false;
    } else if (filter_3_state && turnCount == 4) {
      resList = reqFunc(FILTER_3_ID);
      bk = turnCount;
      excludeState = false;
    } else if (filter_4_state && turnCount == 1) {
      resList = reqFunc(FILTER_4_ID);
      bk = turnCount;
      excludeState = false;
    } else if (filter_5_state && turnCount == 3) {
      resList = reqFunc(FILTER_5_ID);
      bk = turnCount;
      excludeState = false;
    } else if (filter_6_state && turnCount == 5) {
      resList = reqFunc(FILTER_6_ID);
      bk = turnCount;
      excludeState = false;
    } else if (filter_7_state && turnCount == 6) {
      resList = reqFunc(FILTER_7_ID);
      bk = turnCount;
      excludeState = false;
    } else if (filter_8_state && turnCount == 7) {
      resList = reqFunc(FILTER_8_ID);
      bk = turnCount;
      excludeState = false;
    } else if (turnCount == 8) {
      if (toExclude.length > 0) {
        excludeFunc();
      };
      turnCount = REQQue[0];
      excludeState = true;
      sendData(req_bk_data);
      clearData();
    }
    if (!excludeState) {
      let index = REQQue.indexOf(turnCount) + 1;
      turnCount = REQQue[index];
    }
    if (!excludeState && resList !== undefined && resList !== null && resList !== []) {
      createJSONArray(resList);
    }
  }
}
setTimeout(function doTask() {
  mainFunc();
  setTimeout(doTask, delay)
}, delay);
// Request body
let body = "auto_update=false&notification_sound=false&notification_popup=false&show_event_arbs=true&grouped=false&per_page=30&sort_by=age&event_id=&q=&event_arb_types%5B%5D=1&event_arb_types%5B%5D=2&event_arb_types%5B%5D=3&event_arb_types%5B%5D=4&event_arb_types%5B%5D=5&event_arb_types%5B%5D=6&event_arb_types%5B%5D=7&bookmaker_koefs=4-1.6-2.25-0%2C6-1.6-2.25-0%2C10-1.6-2.25-0%2C19-1.6-2.25-0%2C21-1.6-2.25-0%2C27-1.6-2.25-0&bk_ids%5B%5D=1&bk_ids%5B%5D=2&bk_ids%5B%5D=3&bk_ids%5B%5D=4&bk_ids%5B%5D=5&bk_ids%5B%5D=6&bk_ids%5B%5D=7&bk_ids%5B%5D=8&bk_ids%5B%5D=9&bk_ids%5B%5D=10&bk_ids%5B%5D=11&bk_ids%5B%5D=12&bk_ids%5B%5D=13&bk_ids%5B%5D=14&bk_ids%5B%5D=15&bk_ids%5B%5D=16&bk_ids%5B%5D=17&bk_ids%5B%5D=18&bk_ids%5B%5D=19&bk_ids%5B%5D=20&bk_ids%5B%5D=21&bk_ids%5B%5D=22&bk_ids%5B%5D=23&bk_ids%5B%5D=24&bk_ids%5B%5D=25&bk_ids%5B%5D=26&bk_ids%5B%5D=27&bk_ids%5B%5D=28&bk_ids%5B%5D=29&bk_ids%5B%5D=30&bk_ids%5B%5D=31&bk_ids%5B%5D=32&bk_ids%5B%5D=33&bk_ids%5B%5D=34&bk_ids%5B%5D=35&bk_ids%5B%5D=36&bk_ids%5B%5D=37&bk_ids%5B%5D=38&bk_ids%5B%5D=39&bk_ids%5B%5D=40&bk_ids%5B%5D=41&bk_ids%5B%5D=42&bk_ids%5B%5D=43&bk_ids%5B%5D=44&bk_ids%5B%5D=45&bk_ids%5B%5D=46&bk_ids%5B%5D=47&bk_ids%5B%5D=48&bk_ids%5B%5D=49&bk_ids%5B%5D=50&bk_ids%5B%5D=51&bk_ids%5B%5D=52&bk_ids%5B%5D=53&bk_ids%5B%5D=54&bk_ids%5B%5D=55&bk_ids%5B%5D=56&bk_ids%5B%5D=57&bk_ids%5B%5D=58&bk_ids%5B%5D=59&bk_ids%5B%5D=60&bk_ids%5B%5D=61&bk_ids%5B%5D=62&bk_ids%5B%5D=63&bk_ids%5B%5D=64&bk_ids%5B%5D=65&bk_ids%5B%5D=66&bk_ids%5B%5D=67&bk_ids%5B%5D=68&bk_ids%5B%5D=69&bk_ids%5B%5D=70&bk_ids%5B%5D=71&bk_ids%5B%5D=72&bk_ids%5B%5D=73&bk_ids%5B%5D=74&bk_ids%5B%5D=75&bk_ids%5B%5D=76&bk_ids%5B%5D=77&bk_ids%5B%5D=78&bk_ids%5B%5D=79&bk_ids%5B%5D=80&bk_ids%5B%5D=81&bk_ids%5B%5D=82&bk_ids%5B%5D=83&bk_ids%5B%5D=84&bk_ids%5B%5D=85&bk_ids%5B%5D=86&bk_ids%5B%5D=87&bk_ids%5B%5D=88&bk_ids%5B%5D=89&bk_ids%5B%5D=90&bk_ids%5B%5D=91&bk_ids%5B%5D=92&bk_ids%5B%5D=93&bk_ids%5B%5D=94&bk_ids%5B%5D=95&bk_ids%5B%5D=96&bk_ids%5B%5D=97&bk_ids%5B%5D=98&bk_ids%5B%5D=99&bk_ids%5B%5D=100&bk_ids%5B%5D=101&bk_ids%5B%5D=102&bk_ids%5B%5D=103&bk_ids%5B%5D=104&bk_ids%5B%5D=105&bk_ids%5B%5D=106&bk_ids%5B%5D=107&bk_ids%5B%5D=108&bk_ids%5B%5D=109&bk_ids%5B%5D=110&bk_ids%5B%5D=111&bk_ids%5B%5D=112&bk_ids%5B%5D=113&bk_ids%5B%5D=114&bk_ids%5B%5D=115&bk_ids%5B%5D=116&bk_ids%5B%5D=117&bk_ids%5B%5D=118&bk_ids%5B%5D=119&bk_ids%5B%5D=120&bk_ids%5B%5D=121&bk_ids%5B%5D=122&bk_ids%5B%5D=123&bk_ids%5B%5D=124&bk_ids%5B%5D=125&is_live=false&search_filter%5B%5D="
// Sending requets to AllBestBets.com to get bets data
let reqFunc = filterId => {
  try {
    let reqBody = body + filterId;
    let token = access_token.toString()
    xhr.open('POST', `https://api-pr.allbestbets.com/api/v1/arbs/pro_search?access_token=${token}`, false);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(reqBody);
    log.info(`REQ.STATUS: ${xhr.status}`);
    if (xhr.status === 200) {
      let res = JSON.parse(xhr.responseText);
      return res;
    } else {
      log.error(`ERROR REQ.STATUS: ${xhr.status}`);
      console.log(`ERROR REQ.STATUS: ${xhr.status}`);
      return null
    };
  } catch (e) {
    log.error(`ERROR REQUEST:\n ${e.message}`);
    console.log(`ERROR REQUEST:\n ${e.message}`);
    return null;
  }
}
// Parsing result to JSON array
let createJSONArray = resList => {
  try {
    // RESULT is here
    let result = [];
    // Getting all the bets from response
    let betList;
    betList = resList.bets.filter(el => {
      return el.bookmaker_id !== 1;
    });
    // BK number, bets related to
    let bk_num = betList[0].bookmaker_id;

    try {
      if (Number(bk_num) == Number(19)) {
        bk_num = 11;
      }
    } catch (e) {
      log.error(`ERROR BK NUMBER: ${e.message}`);
      console.log(`ERROR BK NUMBER: ${e.message}`)
      bk_num = betList[0].bookmaker_id;
    }
    // For each of bets doing:
    betList.forEach(el => {
      // Bet's JSON obj
      let jsObj = {
        "id": null,
        "sport_name": null,
        "bookmaker": null,
        "full_name": null,
        "mv": null,
        "value": null,
        "koef": null,
        "period": null,
        "link": null,
        "swap": null,
        "event_name": null
      }
      jsObj.id = el.id;
      let sport_id = resList.arbs.find(({
        bet1_id,
        bet2_id
      }) => bet1_id == jsObj.id || bet2_id == jsObj.id).sport_id;
      jsObj.event_name = resList.arbs.find(({
        bet1_id,
        bet2_id
      }) => bet1_id == jsObj.id || bet2_id == jsObj.id).event_name_ru;
      jsObj.sport_name = abbData.sports.find(({
        id
      }) => id === sport_id).name;
      jsObj.bookmaker = abbData.bookmakers.arbs.find(({
        id
      }) => id === el.bookmaker_id).name;
      jsObj.koef = el.koef;
      jsObj.period = abbData.periods.find(({
        id
      }) => id === el.period_id).title;
      jsObj.link = `/bets/${jsObj.id}?access_token=${access_token}&is_live=0`;
      jsObj.swap = el.swap_teams;
      let tmp = abbData.bet_combinations.find(({
        id
      }) => id === el.bc_id);
      if (tmp !== undefined) {
        if (tmp.value_id !== null) {
          jsObj.value = abbData.bet_values.find(({
            id
          }) => id === tmp.value_id).value;
        } else {
          jsObj.value = null;
        }
        jsObj.mv = abbData.market_variations.find(({
          id
        }) => id === tmp.mv_id).title;
        jsObj.full_name = fullNames[jsObj.mv].replace("%s", jsObj.value);
        result.push(jsObj);
      } else {
        log.error(`PARSE ERROR(CANT FIND):\n ${JSON.stringify(el)}`);
        console.log(`PARSE ERROR(CANT FIND):\n ${JSON.stringify(el)}`);
      }
    });
    let bk_id = CORRELATOR[`id${bk_num}`];
    req_bk_data[bk_id] = req_bk_data[bk_id].concat(result);
  } catch (e) {
    log.error(`ERROR IN createJSONArray ${e.message}`);
    console.log(`ERROR IN createJSONArray ${e.message}`);
  };
}
// Checking bet's for excluding by it's ID
let checkExclude = betID => {
  if (!toExclude.includes(betID)) {
    toExclude.push(betID)
  }
  return;
}
// Function to exclude bet from the ABB spread
let excludeFunc = () => {
  try {
    let bet_id = toExclude.shift();
    log.info(`EXCLUDED: ${bet_id}`);
    console.log(`EXCLUDED: ${bet_id}`);
    xhr.open('POST', `https://api-pr.allbestbets.com/api/v1/excluded/bets/${bet_id}?access_token=${access_token}`, false);
    xhr.send();
  } catch (e) {
    log.error(`ERROR EXCLUDE:\n ${e.message}`);
    console.log(`ERROR EXCLUDE:\n ${e.message}`);
  }
}
// Clear the request's data of previous turn
let clearData = () => {
  req_bk_data.forEach(el => {
    el = [];
  });
}
// Function of sending data to the main thread;
let sendData = (result) => {
  process.send({
    data: result
  });
}
// Working with messages from the main thread
process.on('message', (e) => {
  let data = e.data;
  switch (e.cmd) {
    case "start":
      workState = true;
      break;
    case "settings":
      access_token = data.access_token;
      filter_1_state = data.filter_1;
      filter_2_state = data.filter_2;
      filter_3_state = data.filter_3;
      filter_4_state = data.filter_4;
      filter_5_state = data.filter_5;
      filter_6_state = data.filter_6;
      filter_7_state = data.filter_7;
      filter_8_state = data.filter_8;
      let activeCount = 0;
      REQQue = [];
      if (filter_1_state) {
        activeCount++;
        REQQue.push(0);
      }
      if (filter_2_state) {
        activeCount++;
        REQQue.push(1);
      }
      if (filter_3_state) {
        activeCount++;
        REQQue.push(2);
      }
      if (filter_4_state) {
        activeCount++;
        REQQue.push(3);
      }
      if (filter_5_state) {
        activeCount++;
        REQQue.push(4);
      }
      if (filter_6_state) {
        activeCount++;
        REQQue.push(5);
      }
      if (filter_7_state) {
        activeCount++;
        REQQue.push(6);
      }
      if (filter_8_state) {
        activeCount++;
        REQQue.push(7);
      }
      REQQue.push(8);
      turnCount = REQQue[0];
      actives = activeCount;
      log.info(REQQue);
      break;
    case "stop":
      workState = false;
      break;
    case "exclude":
      checkExclude(data.bet_id);
      break;
    case "terminate": {
      workState = false;
      break;
    }
  }
})
