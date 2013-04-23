var EvImages = {
	goal: 'http://cdn1.iconfinder.com/data/icons/ballcons/png/classic.png',
	ocasion: 'http://cdn1.iconfinder.com/data/icons/ballcons/png/classic.png'
};

var response = null;

var saveUserToken = function() {
	var token = $('input#user_token').val();
	localStorage['userToken'] = token;
};

var updateLive = function() {};

var buildMatch = function() {
	if (!response) return null;

	return '2'+' '+'no-suelo'+' : '+'opponent team'+' '+'1';
};

$(document).ready(function() {
  	// disable ajax nav
  	$.mobile.ajaxLinksEnabled = false;

});


$(document).on('pageinit', '#page1', function(){
	if (localStorage['userToken']) {
  		document.location.href = '#page_live';
  		return;
  	}
	/*
	$.ajax({
		url: "http://www77.hattrick.org/Community/CHPP/NewDocs/Example.aspx?file=players&version=2.3&actionType=view"
	})
	.done(function() {
		alert("done");
	}).fail(function(e) {
		alert("fail");
	});
	*/
});

$(document).on('pageinit', '#page_live', function(){
	$.ajax({
		url: "LiveMatchInfoRequest"
	})
	.done(function(xmlDoc) {
		reponse = toJson(xmlDoc);
		var matchText = buildMatch() || '';
		$('#match').text(matchText);
	}).fail(function(e) {
		$('#match').text('No info');
		$('#content').html('<p>No live match available...</p><p>Enter again when your time is playing a match</p>');
	});

    //$('#match').text(localStorage['userToken']);
});
