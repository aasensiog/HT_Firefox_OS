var EvImages = {
    goal: '',
    ocasion: ''
};

var files = {
    teamDetails: {
        file: 'teamdetails',
        version:'3.0'
    },
    live: {
        file: 'live',
        version: '1.8'
    },
    matches: {
        file: 'matches',
        version: '2.6'
    },
    matchDetails: {
        file: 'matchdetails',
        version: '2.5'
    },
    players: {
        file: 'players',
        version: '2.3'
    },
    league: {
        file: 'leaguedetails',
        version: '1.4'
    }
};

var ratings = [
    'disastrous',
    'wretched',
    'poor',
    'weak',
    'inadequate',
    'passable',
    'solid',
    'excellent',
    'formidable',
    'outstanding',
    'brilliant',
    'magnificent',
    'world class',
    'supernatural',
    'titanic',
    'extra-terrestrial',
    'mythical',
    'magical',
    'utopian',
    'divine'
];

var getSkill = function(skillLevel) {
    return ratings[skillLevel];
};

var getRating = function(rat) {
    var div = Math.floor((rat-1) / 4);
    var rest = (rat-1) % 4;
    var sublevel = '';

    switch (rest) {
        case 0:
            sublevel = '--';
            break;
        case 1:
            sublevel = '-';
            break;
        case 2:
            sublevel = '+';
            break;
        case 3:
            sublevel = '++';
            break;
    }
    return ratings[div]+sublevel;
};

var Attitude = {
    Normal: 'Normal',
    Mots: 'Mots',
    Pic: 'Pic'
};

var getAttitude = function(att) {
    if (!att) return null;
    switch (att) {
        case '-1':
            return Attitude.Pic;
        case '1':
            return Attitude.Mots;
        default:
            return Attitude.Normal;
    }
};

var getInjurySign = function(injuryLevel) {
    if (injuryLevel == -1) {
        return null;
    } else if (injuryLevel == 0) {
        return 1;
    } else if (!!parseInt(injuryLevel,10)){
        return 2;
    } else {
        return null;
    }
};

var getMatchMinute = function(matchTime) {
    var d = new Date(matchTime);
    var now = new Date();
    var minutes = (now-d)*1000*60;
    if (minutes > 45 && minutes < 60) {
        return null;
    } else if (minutes < 45) {
        return minutes;
    } else {
        return minutes - 15;
    }
};

var matchTypes = {
    1:   'League match',
    2:   'Qualification match',
    3:   'Cup match (standard league match)',
    4:   'Friendly (normal rules)',
    5:   'Friendly (cup rules)',
    6:   'Not currently in use, but reserved for international competition matches with normal rules (may or may not be implemented at some future point).',
    7:   'Hattrick Masters',
    8:   'International friendly (normal rules)',
    9:   'Internation friendly (cup rules)',
    10:  'National teams competition match (normal rules)',
    11:  'National teams competition match (cup rules)',
    12:  'National teams friendly',
    50:  'Tournament League match',
    51:  'Tournament Playoff match',
    100: 'Youth league match',
    101: 'Youth friendly match',
    102: 'RESERVED',
    103: 'Youth friendly match (cup rules)',
    104: 'RESERVED',
    105: 'Youth international friendly match',
    106: 'Youth international friendly match (Cup rules)',
    107: 'RESERVED'
};

var matchTypeImages = {
    friendly: 'friendly.png',
    league: 'league.png',
    cup: 'cup.png',
    promo: 'promo.png'
};

var getMatchTypeImage = function(type) {
    switch(type) {
        case '4':
        case '5':
        case '8':
        case '9':
        case '12':
        case '101':
        case '103':
        case '105':
        case '106':
            return matchTypeImages.friendly;
        case '1':
            return matchTypeImages.league;
        case '3':
            return matchTypeImages.cup;
        case '2':
            return matchTypeImages.promo;
        default:
            return '';
    }
};

var getMinutesFromInit = function(stringStart) {

    var startingDate = new Date(Date.parse(stringStart.replace(' ', 'T'))),
        nowDate = new Date(),
        diff = (nowDate - startingDate) / 60000;

    if (diff) {

        if (diff >= 60) {
            return parseInt(diff - 15);
        } else if (diff > 45) {
            return 'halftime';
        } else {
            return parseInt(diff);
        }
    } else {
        return 'Started at: ' + stringStart;
    }

};

