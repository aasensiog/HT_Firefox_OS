var EvImages = {
	goal: 'http://cdn1.iconfinder.com/data/icons/ballcons/png/classic.png',
	ocasion: 'http://cdn1.iconfinder.com/data/icons/ballcons/png/classic.png'
};

var response = null;

var saveUserToken = function() {
	var token = $('input#user_token').val();
	localStorage['userToken'] = token;
};

var buildMatch = function() {
	if (!response) return null;

	return '2'+' '+'no-suelo'+' : '+'opponent team'+' '+'1';
};

$(document).ready(function() {
  	// disable ajax nav
  	//$.mobile.ajaxLinksEnabled = false;

});


$(document).on('pageinit', '#page_home', function() {
	var authorizeA = $('#authorize');
	authorizeA.hide();

	if (localStorage['oauth_token']) {
  		console.log('Tengo el oauth token');
  		if(localStorage['caca']) {
  			console.log('Tengo el acces token')
  		} else {
  			console.info(getConsumerInfo().serviceProvider.authorize_url+'?oauth_token='+localStorage['oauthToken']);
  			authorizeA.attr('href',
  				getConsumerInfo().serviceProvider.authorize_url+'?oauth_token='+localStorage['oauth_token']);
  			authorizeA.show();
  		}
  	} else {
        request_token();
    }
});

$(document).on('pageinit', '#page_live', function(){
	$.ajax({
		url: "LiveMatchInfoRequest",
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
