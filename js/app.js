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

$(document).on('pageshow', '#matchList', function() {
    getData(files.matches).done(function(resp) {
        //TODO: Create a list of a with href=#live/match?id=matchId
        var xmlDoc = $.parseXML(resp),
            $xml = $(xmlDoc);

        $('#list').html('');

        var divider1 = false;
        var divider2 = false;
        var matchList = $xml.find('MatchList');
        matchList.find('Match').each(function() {
            matchId = $(this).find('MatchID').text();
            matchStatus = $(this).find('Status').text();
            matchHomeGoals = $(this).find('HomeGoals').text();
            matchAwayGoals = $(this).find('AwayGoals').text();
            homeTeamName = $(this).find('HomeTeam').find('HomeTeamNameShortName').text();
            awayTeamName = $(this).find('AwayTeam').find('AwayTeamNameShortName').text();

            var str = homeTeamName+' '+matchHomeGoals+'-'+matchAwayGoals+' '+awayTeamName;
            if (matchStatus === 'FINISHED') {
                if (!divider1) {
                    $('#list').append("<li data-role='list-divider'>Finished</li>");
                    divider1 = true;
                }
                $('#list').append("<li><a href='#match?id="+matchId+"'>"+str+"</a></li>");
            } else {
                if (!divider2) {
                    $('#list').append("<li data-role='list-divider'>Ongoing and Future</li>");
                    divider2 = true;
                }
                $('#list').append("<li><a href='#live?id="+matchId+"'>"+str+"</a></li>");
            }
            /*
            if (matchStatus === 'FINISHED') {
                $('#list').append("<a href='#match' ><li>"+str+"</li></a>");
            } else {
                $('#list').append("<a href='#live' ><li>"+str+"</li></a>");
            }
            */
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
        var matchId = localStorage.getItem('currentMatch');
        console.log(matchId);
});

$(document).on('pageshow', '#live', function() {
    var matchId = localStorage.getItem('currentMatch');
    console.log(matchId);
});
