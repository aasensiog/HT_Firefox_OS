var EvImages = {
    goal: 'http://cdn1.iconfinder.com/data/icons/ballcons/png/classic.png',
    ocasion: 'http://cdn1.iconfinder.com/data/icons/ballcons/png/classic.png'
};

var files = {
    teamDetails: {
        file: 'teamdetails',
        version:'2.8'
    },
    live:  {
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
}

var _getWeather = function(weatherId) {
    return 'cloudy';
};

var getAttitude = function(att) {
    switch (att) {
        case -1:
            return Attitude.Pic;
        case 1:
            return Attitude.Mots;
        default:
            return Attitude.Normal;
    }
};
