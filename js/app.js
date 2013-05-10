var EvImages = {
	goal: 'http://cdn1.iconfinder.com/data/icons/ballcons/png/classic.png',
	ocasion: 'http://cdn1.iconfinder.com/data/icons/ballcons/png/classic.png'
};

var response = null;

var saveOauthVerifier = function() {
    alert('saveOauthVerifier');
	var verifier = $('input#oauth_verifier').val();
    if (verifier) {
        localStorage['oauth_verifier'] = verifier;
        getAccessToken().done(function() {
            //TODO: go to Live page
            console.log('Tengo el accessoooo');
            localStorage['ok'] = true;
        });
    } else {
        alert('You must enter the authorization code');
    }
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

    var step1 = function() {
        if (!localStorage['oauth_token']) {
            request_token().done(function() {
                step2();
            });
        } else {
            step2();
        }
    };

    var step2 = function() {
        console.log('Tengo el oauth token');
        if (!localStorage['oauth_verifier']) {
            console.info(getConsumerInfo().serviceProvider.authorize_url+'?oauth_token='+localStorage['oauthToken']);
            authorizeA.attr('href',
                getConsumerInfo().serviceProvider.authorize_url+'?oauth_token='+localStorage['oauth_token']);
            authorizeA.show();
        }
    };

    if (!localStorage['ok']) {
        step1();
    } else {
        //TODO: We have access, go to page live
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
