
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
    $('#content_matchList').html('');
    getData(files.matches)
    .done(function(resp) {
        //TODO: Create a list of a with href=#live/match?id=matchId
        var xmlDoc = $.parseXML(resp),
            $xml = $(xmlDoc);

        var divider1 = false;
        var divider2 = false;
        var divider3 = false;
        var matchList = $xml.find('MatchList');
        var maList = {
            finished: {
                list: [],
                fill: false
            },
            ongoing: {
                list: [],
                fill: false
            },
            future: {
                list: [],
                fill: false
            }
        };

        matchList.find('Match').each(function() {
            matchId = $(this).find('MatchID').text();
            matchStatus = $(this).find('Status').text();
            matchHomeGoals = $(this).find('HomeGoals').text();
            matchAwayGoals = $(this).find('AwayGoals').text();
            homeTeamName = $(this).find('HomeTeam').find('HomeTeamNameShortName').text();
            awayTeamName = $(this).find('AwayTeam').find('AwayTeamNameShortName').text();

            var obj = {
                matchId: matchId,
                matchStatus: matchStatus,
                matchHomeGoals: matchHomeGoals,
                matchAwayGoals: matchAwayGoals,
                homeTeamName: homeTeamName,
                awayTeamName: awayTeamName
            };

            if (matchStatus === 'FINISHED') {
                console.log('Pushing');
                console.log(obj);
                maList.finished.list.push(obj);
                maList.finished.fill = true;
            } else if (matchStatus === 'ONGOING') {
                maList.ongoing.list.push(obj);
                maList.ongoing.fill = true;
            } else {
                maList.future.list.push(obj);
                maList.future.fill = true;
            }
        });

        $.Mustache.load('templates/matches_list.html', function() {
            $('#content_matchList').mustache('matches_list', maList);
            $('#list_matches').listview();
        });

    }).fail(function() {
        alert('fail');
    }).always(function() {
        $.mobile.hidePageLoadingMsg();
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
    getData(files.matchDetails, params)
    .done(function(resp) {
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
            $('#list_goals').listview();
        });
        $('#ratingsTable').table( "refresh" );

    }).fail(function() {
        alert('fail');
    }).always(function() {
        $.mobile.hidePageLoadingMsg();
    });
});

$(document).on('pageshow', '#live', function() {
    var matchId = null;
    if ($.mobile.pageData && $.mobile.pageData.id) {
        matchId = $.mobile.pageData.id;
    }

    var liveMatchesAdded = JSON.parse(localStorage.getItem('liveMatchesAdded'));
    if (!liveMatchesAdded) {
        liveMatchesAdded = [];
        localStorage.setItem(JSON.stringify(liveMatchesAdded));
    }

    if (liveMatchesAdded.indexOf(matchId) === -1) {
        var params = {
            actionType: 'addMatch',
            matchID: matchId
        };

        $.mobile.showPageLoadingMsg("a", "Adding match to live...");
        getData(files.live, params)
        .done(function() {
            liveMatchesAdded.push(matchId);
            localStorage.setItem(JSON.stringify(liveMatchesAdded));
            refreshLiveMatch(matchId);
        }).fail(function() {
            alert('Error adding match, please try again.');
        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    } else {
        refreshLiveMatch(matchId);
    }
});

var refreshLiveMatch = function(matchId) {

    var params = {
        actionType: 'viewAll',
        matchID: matchId
    };

    $.mobile.showPageLoadingMsg("a", "Loading live match info...");
    $('#content').html('');
    getData(files.live, params)
    .done(function(resp) {
        var xmlDoc = $.parseXML(resp),
            $xml = $(xmlDoc);
        var matches = $xml.find('MatchList');
            matches.find('Match').each(function() {
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
                    var html = mustache('live', obj);
                    $('#content_live').html(html);
                    $('#list_live').listview();
                });
            }
        });
    }).always(function() {
        $.mobile.hidePageLoadingMsg();
    });
};


$(document).on('pageshow', '#team', function() {
    getData(files.teamDetails).done(function(resp) {
        var xmlDoc = $.parseXML(resp),
            $xml = $(xmlDoc);


    }).fail(function() {
        alert('fail');
    });
});

$(document).on('pageshow', '#players', function() {
    getData(files.players).done(function(resp) {
        var xmlDoc = $.parseXML(resp),
            $xml = $(xmlDoc),
            team = $xml.find('Team'),
            players = team.find('PlayerList'),
            playerList = [],
            obj = {
                teamName: team.find('TeamName').text()
            };

        players.find('Player').each(function() {
            playerList.push({
                name: $(this).find('NickName').text()
            });
        });

        obj.players = playerList;

        $.Mustache.load('templates/players.html', function() {
            var html = mustache('players', obj);
            $('#content_players').html(html);
        });

    }).fail(function() {
        alert('fail');
    });
});

var updateMatchList = function() {
    alert('update match list');
};
