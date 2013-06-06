var saveOauthVerifier = function() {
    console.log('savingOauthVerifier');
	var verifier = $('input#oauth_verifier').val();
    if (verifier) {
        localStorage.setItem('oauth_verifier', verifier);
        $.mobile.showPageLoadingMsg("a", "Verifying");
        getAccessToken().done(function() {
            alert('Verified');
            //TODO: go to Live page
            document.location.href ='#menu';
        }).fail(function() {
            alert('ERROR oauth verifier');
        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    } else {
        alert('You must enter the authorization code');
    }
};

var step1 = function() {
    var authorizeA = $('#authorize');
	authorizeA.hide();
    console.log('step1');
    if (!localStorage.getItem('oauth_token')) {
        console.log(localStorage.getItem('oauth_token'));
        $.mobile.showPageLoadingMsg("a", "Loading ...");
        request_token().done(function() {
            step2();
        }).fail(function() {
            alert('Conection error');
        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    } else {
        step2();
    }
};

var step2 = function() {
    console.log('step2');
    $('#auth_html').show();

    if (!localStorage.getItem('oauth_verifier')) {
        var authorizeA = $('#authorize');
        console.info(getConsumerInfo().serviceProvider.authorize_url+'?oauth_token='+localStorage.getItem('oauth_token'));
        authorizeA.attr('href',
            getConsumerInfo().serviceProvider.authorize_url+'?oauth_token='+localStorage.getItem('oauth_token'));
        authorizeA.show();
    } else {
        $('input#oauth_verifier').val(localStorage.getItem('oauth_verifier'));
    }
};

var logout = function() {
    logOut()
    .done(function() {
        alert('Logout done successfully');
        localStorage.clear();
        document.location.href = '#index';
    })
    .fail(function() {
        alert('Logout failed, try again');
    });
};
