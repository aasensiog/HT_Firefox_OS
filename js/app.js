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
    }
};

$(document).on('pageinit', '#index', function() {
    if (!localStorage.getItem('ok_oauth_token')) {
        document.location.href = '#authentication';
    } else {
        console.log('tenemos el ok_access_token');
        console.log(localStorage.getItem('ok_oauth_token'));
        document.location.href = '#menu';
    }
});

$(document).on('pageinit', '#menu', function() {

});

$(document).on('pageinit', '#authentication', function() {
    console.log('No tenemos el ok_access_token');
    console.log(localStorage.getItem('ok_oauth_token'));
    step1();
});

$(document).on('pageinit', '#matchList', function() {
    getData(files.matches).done(function(resp) {
        //TODO: Create a list of a with href=#live/match?id=matchId
        alert(resp);
    }).fail(function() {
        alert('fail');
    });
});

$(document).on('pageinit', '#team', function() {
    getData(files.teamDetails).done(function(resp) {
        alert(resp);
    }).fail(function() {
        alert('fail');
    });
});

$(document).on('pageinit', '#match', function() {
    var splitHref = window.location.href.split("?"),
        idHref = splitHref[1].split("="),
        matchId = idHref[1];

});

$(document).on('pageinit', '#live', function() {
    var splitHref = window.location.href.split("?"),
        idHref = splitHref[1].split("="),
        matchId = idHref[1];


});
