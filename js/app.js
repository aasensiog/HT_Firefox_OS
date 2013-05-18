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

$(document).bind("pagebeforechange", function( event, data ) {
    $.mobile.pageData = (data && data.options && data.options.pageData)
        ? data.options.pageData
        : null;
});

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

$(document).on('pageshow', '#matchList', function() {
    getData(files.matches).done(function(resp) {
        //TODO: Create a list of a with href=#live/match?id=matchId
        var xmlDoc = $.parseXML(resp),
            $xml = $(xmlDoc);

        $('#list').html('');

        var divider1 = false;
        var divider2 = false;
        var divider3 = false;
        var matchList = $xml.find('MatchList');
        matchList.find('Match').each(function() {
            matchId = $(this).find('MatchID').text();
            matchStatus = $(this).find('Status').text();
            matchHomeGoals = $(this).find('HomeGoals').text();
            matchAwayGoals = $(this).find('AwayGoals').text();
            homeTeamName = $(this).find('HomeTeam').find('HomeTeamNameShortName').text();
            awayTeamName = $(this).find('AwayTeam').find('AwayTeamNameShortName').text();

            var str = homeTeamName+' '+matchHomeGoals+' - '+matchAwayGoals+' '+awayTeamName;
            if (matchStatus === 'FINISHED') {
                if (!divider1) {
                    $('#list').append("<li data-role='list-divider'>Finished</li>");
                    divider1 = true;
                }
                $('#list').append("<li><a href='#match?id="+matchId+"'>"+str+"</a></li>");
            } 
            else if (matchStatus === 'ONGOING') {
                if (!divider3) {
                    $('#list').append("<li data-role='list-divider'>Ongoing</li>");
                    divider3 = true;
                }
                $('#list').append("<li><a href='#live?id="+matchId+"'>"+str+"</a></li>");
            } else {
                if (!divider2) {
                    $('#list').append("<li data-role='list-divider'>Future</li>");
                    divider2 = true;
                }
                $('#list').append("<li data-icon='alert'><a>"+str+"</a></li>");
            }
        });
        $( "#list" ).listview('refresh');

    }).fail(function() {
        alert('fail');
    });
});

$(document).on('pageshow', '#team', function() {
    getData(files.teamDetails).done(function(resp) {
        alert(resp);
    }).fail(function() {
        alert('fail');
    });
});

$(document).on('pageshow', '#match', function() {
    if ($.mobile.pageData && $.mobile.pageData.id) {
        var matchId = $.mobile.pageData.id;
    }
    var params = {
        matchID: matchId
    }
    getData(files.matchDetails, params).done(function(resp) {
        var xmlDoc = $.parseXML(resp),
            $xml = $(xmlDoc);
        $('#content').html();
        
        $.Mustache.load('templates/match.html', function() {
            $('#content').mustache('match', {matchId: 'albert'});
        });

    }).fail(function() {
        alert('fail');
    });
});

$(document).on('pageshow', '#live', function() {
    if ($.mobile.pageData && $.mobile.pageData.id) {
        var matchId = $.mobile.pageData.id;
    }
    console.log(matchId);
});
