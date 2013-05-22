
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
    $.mobile.showPageLoadingMsg("a", "Loading matches list...");
    $('#list').html('');
    getData(files.matches).done(function(resp) {
        //TODO: Create a list of a with href=#live/match?id=matchId
        var xmlDoc = $.parseXML(resp),
            $xml = $(xmlDoc);

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
    }).always(function() {
        $.mobile.hidePageLoadingMsg();
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
    };
    $.mobile.showPageLoadingMsg("a", "Loading match info...");
    $('#content').html('');
    getData(files.matchDetails, params).done(function(resp) {
        var xmlDoc = $.parseXML(resp),
            $xml = $(xmlDoc);

        var homeTeam = $xml.find('HomeTeam'),
            awayTeam = $xml.find('AwayTeam'),
            arena = $xml.find('Arena'),
            scorers = $xml.find('Scorers'),
            injuries = $xml.find('Injuries')


        var obj = {
            homeTeam: {
                name: homeTeam.find('HomeTeamName').text(),
                id: homeTeam.find('HomeTeamID').text(),
                goals: homeTeam.find('HomeGoals').text(),
                attitude: getAttitude(homeTeam.find('TeamAttitude').text()),
                formation: homeTeam.find('Formation').text(),
                ratings: {
                    mid: getRating(homeTeam.find('RatingMidfield').text()),
                    defR: getRating(homeTeam.find('RatingRightDef').text()),
                    defM: getRating(homeTeam.find('RatingMidDef').text()),
                    defL: getRating(homeTeam.find('RatingLeftDef').text()),
                    attR: getRating(homeTeam.find('RatingRightAtt').text()),
                    attM: getRating(homeTeam.find('RatingMidAtt').text()),
                    attL: getRating(homeTeam.find('RatingLeftAtt').text()),
                    iD: getRating(homeTeam.find('RatingIndirectSetPiecesDef').text()),
                    iA: getRating(homeTeam.find('RatingIndirectSetPiecesAtt').text())
                },
                possession: {
                    firstHalf: $xml.find('PossessionFirstHalfHome').text(),
                    secondHalf: $xml.find('PossessionSecondHalfHome').text()
                }
            },
            awayTeam: {
                name: awayTeam.find('AwayTeamName').text(),
                id: awayTeam.find('AwayTeamID').text(),
                goals: awayTeam.find('AwayGoals').text(),
                attitude: getAttitude(awayTeam.find('TeamAttitude').text()),
                formation: awayTeam.find('Formation').text(),
                ratings: {
                    mid: getRating(awayTeam.find('RatingMidfield').text()),
                    defR: getRating(awayTeam.find('RatingRightDef').text()),
                    defM: getRating(awayTeam.find('RatingMidDef').text()),
                    defL: getRating(awayTeam.find('RatingLeftDef').text()),
                    attR: getRating(awayTeam.find('RatingRightAtt').text()),
                    attM: getRating(awayTeam.find('RatingMidAtt').text()),
                    attL: getRating(awayTeam.find('RatingLeftAtt').text()),
                    iD: getRating(awayTeam.find('RatingIndirectSetPiecesDef').text()),
                    iA: getRating(awayTeam.find('RatingIndirectSetPiecesAtt').text())
                },
                possession: {
                    firstHalf: $xml.find('PossessionFirstHalfAway').text(),
                    secondHalf: $xml.find('PossessionSecondHalfAway').text()
                }
            },
            arena: {
                name: arena.find('ArenaName').text(),
                weather: _getWeather(arena.find('WeatherID').text()),
                soldTotal: arena.find('SoldTotal').text()
            }
        };

        var goals = [];
        scorers.find('Goal').each(function() {
            goals.push({
                scorerPlayerName: $(this).find('ScorerPlayerName').text(),
                homeScorer: $(this).find('ScorerTeamID').text() === obj.homeTeam.id,
                scorerMinute: $(this).find('ScorerMinute') .text()
            });
        });
        obj.goals = goals;

        var injuriesList = [];
        injuries.find('Injury').each(function() {
            injuriesList.push({
                injuryPlayerName: $(this).find('InjuryPlayerName').text(),
                injuryType: $(this).find('InjuryType').text(),
                injuryHome: $(this).find('InjuryTeamID').text() === obj.homeTeam.id,
                injuryMinute: $(this).find('InjuryMinute').text()
            });
        });
        obj.injuries = injuriesList;

        $.Mustache.load('templates/match.html', function() {
            $('#content').mustache('match', obj);
            $('#list').listview('refresh');
        });
        $('#ratingsTable').table( "refresh" );
        $('#list').listview('refresh');

    }).fail(function() {
        alert('fail');
    }).always(function() {
        $.mobile.hidePageLoadingMsg();
    });
});

$(document).on('pageshow', '#live', function() {
    if ($.mobile.pageData && $.mobile.pageData.id) {
        var matchId = $.mobile.pageData.id;
    }

    var params = {
        actionType: 'addMatch',
        matchID: matchId
    };

    $.mobile.showPageLoadingMsg("a", "Loading live match info...");
    $('#content').html('');
    getData(files.live, params).done(function(resp) {
        var xmlDoc = $.parseXML(resp),
            $xml = $(xmlDoc);
        var matches = $xml.find('Matches'),
            match = matches.find('Match').each(function() {
            if ($(this).find('MatchID').text() === matchId) {
                var homeTeam = $(this).find('HomeTeam'),
                    awayTeam = $(this).find('AwayTeam'),
                    eventList = $(this).find('EventList');

                var obj = {
                    homeTeam: {
                        name: homeTeam.find('HomeTeamShortName').text(),
                        id: homeTeam.find('HomeTeamID').text(),
                        goals: $(this).find('HomeGoals').text()
                    },
                    awayTeam: {
                        name: awayTeam.find('AwayTeamShortName').text(),
                        id: awayTeam.find('AwayTeamID').text(),
                        goals: $(this).find('AwayGoals').text()
                    }
                };

                var events = [];
                eventList.find('Event').each(function() {
                    events.push({
                        minute: $(this).find('Minute').text(),
                        description: $(this).find('EventText').text(),
                        teamId: $(this).find('SubjectTeamID').text()
                    });
                });
                obj.events = events;

                $.Mustache.load('templates/live.html', function() {
                    $('#content').mustache('live', obj);
                    $('#list').listview('refresh');
                });
            }
        });
    }).always(function() {
        $.mobile.hidePageLoadingMsg();
    });
});
