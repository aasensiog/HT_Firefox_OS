
var liveInterval = null,
    timeMatchListRequested = null,
    timeLegueRequested = null,
    timePlayersRequested = null,
    timeTeamRequested = null,
    playersData = {};

$(document).bind("pagebeforechange", function( event, data ) {
    $.mobile.pageData = data && data.options && data.options.pageData || null
});

$(document).on('pageshow', '#index', function() {
    $('#auth_button').click(function() {
        saveOauthVerifier();
    });
    $('#logout_button').click(function() {
        logout();
    });


    if (!localStorage.getItem('ok_oauth_token')) {
        document.location.href = '#authentication';
    } else {
        //console.log('tenemos el ok_access_token');
        //console.log(localStorage.getItem('ok_oauth_token'));
        document.location.href = '#menu';
    }
});

$(document).on('pageinit', '#menu', function() {
    if (liveInterval) {
        clearInterval(liveInterval);
    }
});

$(document).on('pageinit', '#authentication', function() {
    $('#auth_html').hide();
    $('#internet_connection_html').hide();
    var promise = step1();
    if (promise) {
        promise.fail(function(val) {
            internet_connection_html.show();
        });
    }
});

$(document).on('pageshow', '#matchList', function() {
    if (liveInterval) {
        clearInterval(liveInterval);
    }

    if (!timeMatchListRequested || timeMatchListRequested + 60000 < Date.now()) {
        timeMatchListRequested = Date.now();

        $.mobile.showPageLoadingMsg("a", "Loading matches list...");
        getData(files.matches)
        .done(function(resp) {
            $('#content_matchList').html('');
            var xmlDoc = $.parseXML(resp),
                $xml = $(xmlDoc),
                matchList = $xml.find('MatchList'),
                maList = {
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
                },
                obj = null;

            matchList.find('Match').each(function() {
                var matchType = getMatchTypeImage($(this).find('MatchType').text());
                obj = {
                    matchId: $(this).find('MatchID').text(),
                    matchStatus: $(this).find('Status').text(),
                    matchType: matchType,
                    matchHomeGoals: $(this).find('HomeGoals').text(),
                    matchAwayGoals: $(this).find('AwayGoals').text(),
                    homeTeamName: $(this).find('HomeTeam').find('HomeTeamNameShortName').text(),
                    awayTeamName: $(this).find('AwayTeam').find('AwayTeamNameShortName').text(),
                    matchDate: $(this).find('MatchDate').text(),
                    ordersGiven: $(this).find('OrdersGiven').text() == 'True' ? true : false
                };

                if (obj.matchStatus === 'FINISHED') {
                    maList.finished.list.push(obj);
                    maList.finished.fill = true;
                } else if (obj.matchStatus === 'ONGOING') {
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
            alert('Connection error');
            timeMatchListRequested = null;
        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }
});

$(document).on('pageshow', '#match', function() {
    if (liveInterval) {
        clearInterval(liveInterval);
    }
    if ($.mobile.pageData && $.mobile.pageData.id) {
        var matchId = $.mobile.pageData.id;
    }
    var params = {
        matchID: matchId
    };

    $.mobile.showPageLoadingMsg("a", "Loading match info...");
    getData(files.matchDetails, params)
    .done(function(resp) {
        $('#content').html('');
        var xmlDoc = $.parseXML(resp),
            $xml = $(xmlDoc),
            homeTeam = $xml.find('HomeTeam'),
            awayTeam = $xml.find('AwayTeam'),
            arena = $xml.find('Arena'),
            scorers = $xml.find('Scorers'),
            injuries = $xml.find('Injuries'),
            bookings = $xml.find('Bookings'),
            obj = {
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
                    weather: arena.find('WeatherID').text(),
                    soldTotal: arena.find('SoldTotal').text()
                },
                matchType: getMatchTypeImage($xml.find('MatchType').text())
            },
            goals = [],
            injuriesList = [],
            bookingsList = [];

        scorers.find('Goal').each(function() {
            goals.push({
                scorerPlayerName: $(this).find('ScorerPlayerName').text(),
                homeScorer: $(this).find('ScorerTeamID').text() === obj.homeTeam.id,
                scorerMinute: $(this).find('ScorerMinute').text(),
                homeGoals: $(this).find('ScorerHomeGoals').text(),
                awayGoals: $(this).find('ScorerAwayGoals').text()
            });
        });
        obj.goals = goals;

        injuries.find('Injury').each(function() {
            injuriesList.push({
                injuryPlayerName: $(this).find('InjuryPlayerName').text(),
                injuryType: $(this).find('InjuryType').text(),
                injuryHome: $(this).find('InjuryTeamID').text() === obj.homeTeam.id,
                injuryMinute: $(this).find('InjuryMinute').text()
            });
        });
        obj.injuries = injuriesList;

        bookings.find('Booking').each(function() {
            bookingsList.push({
                bookingPlayerName: $(this).find('BookingPlayerName').text(),
                bookingType: $(this).find('BookingType').text(),
                bookingHome: $(this).find('BookingTeamID').text() === obj.homeTeam.id,
                bookingMinute: $(this).find('BookingMinute').text()
            });
        });
        obj.bookings = bookingsList;

        $.Mustache.load('templates/match.html', function() {
            $('#content').mustache('match', obj);
            $('#list_goals').listview();
        });
        $('#ratingsTable').table( "refresh" );

    }).fail(function() {
        alert('Connection error');
    }).always(function() {
        $.mobile.hidePageLoadingMsg();
    });
});

$(document).on('pageshow', '#live', function() {
    var matchId = null;
    if ($.mobile.pageData && $.mobile.pageData.id) {
        matchId = $.mobile.pageData.id;
    }

    $('#refresh').click(function() {
        refreshLiveMatch(matchId);
    });

    var liveMatchesAdded = JSON.parse(localStorage.getItem('liveMatchesAdded'));
    if (!liveMatchesAdded) {
        liveMatchesAdded = [];
        localStorage.setItem('liveMatchesAdded', JSON.stringify(liveMatchesAdded));
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
            localStorage.setItem('liveMatchesAdded', JSON.stringify(liveMatchesAdded));
            refreshLiveMatch(matchId);
            if (liveInterval) {
                clearInterval(liveInterval);
            }
            liveInterval = setInterval(function() {
                refreshLiveMatch(matchId);
            }, 60000);
        }).fail(function() {
            alert('Error adding match, please try again.');
        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    } else {
        refreshLiveMatch(matchId);
        if (liveInterval) {
            clearInterval(liveInterval);
        }
        liveInterval = setInterval(function() {
            refreshLiveMatch(matchId);
        }, 60000);
    }
});

var refreshLiveMatch = function(matchId) {

    var params = {
        actionType: 'viewAll',
        matchID: matchId
    };

    $.mobile.showPageLoadingMsg("a", "Loading live match info...");
    getData(files.live, params)
    .done(function(resp) {
        $('#content_live').html('');
        var xmlDoc = $.parseXML(resp),
            $xml = $(xmlDoc);
        var matches = $xml.find('MatchList');
            matches.find('Match').each(function() {
            if ($(this).find('MatchID').text() === matchId) {
                var homeTeam = $(this).find('HomeTeam'),
                    awayTeam = $(this).find('AwayTeam'),
                    eventList = $(this).find('EventList'),
                    obj = {
                        homeTeam: {
                            name: homeTeam.find('HomeTeamShortName').text(),
                            id: homeTeam.find('HomeTeamID').text(),
                            goals: $(this).find('HomeGoals').text()
                        },
                        awayTeam: {
                            name: awayTeam.find('AwayTeamShortName').text(),
                            id: awayTeam.find('AwayTeamID').text(),
                            goals: $(this).find('AwayGoals').text()
                        },
                        matchMinute: getMinutesFromInit($(this).find('MatchDate').text()),
                        lastUpdate: (new Date()).toLocaleTimeString()
                    },
                    events = [];

                eventList.find('Event').each(function() {
                    events.push({
                        minute: $(this).find('Minute').text(),
                        eventKey: $(this).find('eventKey').text(), //TODO: translate
                        description: $(this).find('EventText').text().replace(/<[^>]*>/g, ''),
                        teamName: ($(this).find('SubjectTeamID').text() === obj.homeTeam.id) ?
                            obj.homeTeam.name : obj.awayTeam.name
                    });
                });
                obj.events = events;

                $.Mustache.load('templates/live.html', function() {
                    $('#content_live').mustache('live', obj);
                    $('#list_live').listview();
                });
            }
        });
    }).always(function() {
        $.mobile.hidePageLoadingMsg();
    });
};


$(document).on('pageshow', '#team', function() {
    if (liveInterval) {
        clearInterval(liveInterval);
    }
    if (!timeTeamRequested || timeTeamRequested + 60000 < Date.now()) {
        timeTeamRequested = Date.now();

        $.mobile.showPageLoadingMsg("a", "Loading team info...");
        getData(files.teamDetails)
        .done(function(resp) {
            $('#content_team').html('');
            var xmlDoc = $.parseXML(resp),
                $xml = $(xmlDoc),
                user = $xml.find('User'),
                teams = $xml.find('Teams'),
                obj = null;

            obj = {
                user: {
                    username: user.find('Loginname').text(),
                    language: user.find('Language').find('LanguageName').text()
                }
            };

            teams.find('Team').each(function() {
                if ($(this).find('IsPrimaryClub').text()) {
                    obj.team = {
                        name: $(this).find('TeamName').text(),
                        shortName: $(this).find('ShortTeamName').text(),
                        arenaName: $(this).find('Arena').find('ArenaName').text(),
                        leagueName: $(this).find('League').find('LeagueName').text(),
                        regionName: $(this).find('Region').find('RegionName').text(),
                        homePage: $(this).find('HomePage').text(),
                        dressURI: $(this).find('DressURI').text(),
                        dressAlternateURI: $(this).find('DressAlternateURI').text(),
                        leagueLevel: $(this).find('LeagueLevelUnit').find('LeagueLevelUnitName').text(),
                        stillInCup: $(this).find('Cup').find('StillInCup').text() == 'True' ? true : false,
                        numVictories: $(this).find('NumberOfVictories').text(),
                        numUndefeated: $(this).find('NumberOfUndefeated').text(),
                        teamRank: $(this).find('TeamRank').text(),
                        fanClubName: $(this).find('Fanclub').find('FanclubName').text(),

                        logoUrl: $(this).find('LogoURL').text()
                    };
                }
            });

            $.Mustache.load('templates/team.html', function() {
               $('#content_team').mustache('team_details', obj);
            });

        }).fail(function() {
            alert('Connection error');
        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }
});

$(document).on('pageshow', '#player', function() {
    $('#content_player').html('');
    if ($.mobile.pageData && $.mobile.pageData.id && playersData) {
        var playerId = $.mobile.pageData.id,
            playerInfo = playersData[playerId];
            obj = {
                name: $(playerInfo).find('FirstName').text() + ' ' + $(playerInfo).find('LastName').text(),
                number: ($(playerInfo).find('PlayerNumber').text() != 100) ? $(playerInfo).find('PlayerNumber').text() : null,
                age: $(playerInfo).find('Age').text(),
                ageDays: $(playerInfo).find('AgeDays').text(),
                salary: $(playerInfo).find('Salary').text(),
                cards: ($(playerInfo).find('Cards').text() != 0) ? $(playerInfo).find('Cards').text() : null,
                injury: getInjurySign($(playerInfo).find('InjuryLevel').text()),
                tsi: $(playerInfo).find('TSI').text(),
                form: getSkill(parseInt($(playerInfo).find('PlayerForm').text(), 10)),
                experience: getSkill(parseInt($(playerInfo).find('Experience').text(), 10)),
                leadership: getSkill(parseInt($(playerInfo).find('Leadership').text(), 10)),
                lastMatchRating: $(playerInfo).find('LastMatch').find('Rating').text(),

                skills: {
                    stamina: {
                        name: getSkill(parseInt($(playerInfo).find('StaminaSkill').text(), 10)),
                        value: parseInt($(playerInfo).find('StaminaSkill').text())
                    },
                    keeper: {
                        name: getSkill(parseInt($(playerInfo).find('KeeperSkill').text(), 10)),
                        value: parseInt($(playerInfo).find('KeeperSkill').text())
                    },
                    playmaker: {
                        name: getSkill(parseInt($(playerInfo).find('PlaymakerSkill').text(), 10)),
                        value: parseInt($(playerInfo).find('PlaymakerSkill').text())
                    },
                    scorer: {
                        name: getSkill(parseInt($(playerInfo).find('ScorerSkill').text(), 10)),
                        value: parseInt($(playerInfo).find('ScorerSkill').text())
                    },
                    passing: {
                        name: getSkill(parseInt($(playerInfo).find('PassingSkill').text(), 10)),
                        value: parseInt($(playerInfo).find('PassingSkill').text())
                    },
                    defense: {
                        name: getSkill(parseInt($(playerInfo).find('DefenderSkill').text(), 10)),
                        value: parseInt($(playerInfo).find('DefenderSkill').text())
                    },
                    winger: {
                        name: getSkill(parseInt($(playerInfo).find('WingerSkill').text(), 10)),
                        value: parseInt($(playerInfo).find('WingerSkill').text())
                    },
                    setPieces: {
                        name: getSkill(parseInt($(playerInfo).find('SetPiecesSkill').text(), 10)),
                        value: parseInt($(playerInfo).find('SetPiecesSkill').text())
                    }
                }
            };

        $.Mustache.load('templates/player.html', function() {
            $('#content_player').mustache('player', obj);
            $('#playerSkills').table({});
        });
    } else {
        alert('Error retrieving player info');
        document.location.href = '#players';
    }
});

$(document).on('pageshow', '#players', function() {
    if (liveInterval) {
        clearInterval(liveInterval);
    }

    if (!timePlayersRequested || timePlayersRequested + 60000 < Date.now()) {
        timePlayersRequested = Date.now();

        $.mobile.showPageLoadingMsg("a", "Loading players...");
        getData(files.players)
        .done(function(resp) {
            $('#content_players').html('');
            playersData = {};
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
                    id: $(this).find('PlayerID').text(),
                    name: $(this).find('FirstName').text() + ' ' + $(this).find('LastName').text(),
                    number: ($(this).find('PlayerNumber').text() != 100) ? $(this).find('PlayerNumber').text() : null,
                    age: $(this).find('Age').text(),
                    ageDays: $(this).find('AgeDays').text(),
                    salary: $(this).find('Salary').text(),
                    cards: ($(this).find('Cards').text() != 0) ? $(this).find('Cards').text() : null,
                    injury: getInjurySign($(this).find('InjuryLevel').text()),
                    tsi: $(this).find('TSI').text()
                });
                playersData[$(this).find('PlayerID').text()] = this;
            });
            obj.players = playerList;

            $.Mustache.load('templates/players.html', function() {
                $('#content_players').mustache('players', obj);
                $('#list_players').listview();
            });

         }).fail(function() {
            alert('Connection error');
         }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }
});

$(document).on('pageshow', '#league', function() {
    if (liveInterval) {
        clearInterval(liveInterval);
    }

    if (!timeLegueRequested || timeLegueRequested + 60000 < Date.now()) {
        timeLegueRequested = Date.now();

        $.mobile.showPageLoadingMsg("a", "Loading league details...");
        $.when(getData(files.league), getData(files.teamDetails))
        .done(function(respLeague, respTeam) {
            $('#content_league').html('');
            //TeamDetails part
            var teamId = null,
                xmlDoc = $.parseXML(respTeam),
                $xml = $(xmlDoc),
                teamsLeague = $xml.find('Teams'),
                obj = null,
                teams = [];

            teamsLeague.find('Team').each(function() {
                if ($(this).find('IsPrimaryClub').text()) {
                    teamId = $(this).find('TeamID').text();
                }
            });

            //League part
            xmlDoc = $.parseXML(respLeague);
            $xml = $(xmlDoc);

            obj = {
                league: {
                    country: $xml.find('LeagueName').text(),
                    name: $xml.find('LeagueLevelUnitName').text(),
                    currentRound: $xml.find('CurrentMatchRound').text()
                }
            };

            $xml.find('Team').each(function() {
                teams.push({
                    userTeam: (teamId && $(this).find('TeamID').text() === teamId) ? true : false,
                    name: $(this).find('TeamName').text(),
                    position: $(this).find('Position').text(),
                    played: $(this).find('Matches').text(),
                    goalsFor: $(this).find('GoalsFor').text(),
                    goalsAgainst: $(this).find('GoalsAgainst').text(),
                    points: $(this).find('Points').text(),
                    won: $(this).find('Won').text(),
                    lost: $(this).find('Lost').text(),
                    draws: $(this).find('Draws').text()
                });
            });
            obj.teams = teams;

            $.Mustache.load('templates/league.html', function() {
               $('#content_league').mustache('league', obj);
            });

        }).fail(function() {
            alert('Connection error');
        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    }
});

$(document).on('pageinit', '#settings', function() {
    if (liveInterval) {
        clearInterval(liveInterval);
    }

});
