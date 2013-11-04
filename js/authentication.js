var saveOauthVerifier = function() {
    //console.log('savingOauthVerifier');
	var verifier = $('input#oauth_verifier').val();
    if (verifier) {
        localStorage.setItem('oauth_verifier', verifier);
        $.mobile.showPageLoadingMsg("a", "Verifying");
        getAccessToken().done(function() {
            alert('Verification done successfully: Enjoy the app!');
            //TODO: go to Live page
            document.location.href ='#menu';
        }).fail(function() {
            alert('Error verifying code, please review it');
        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    } else {
        alert('You must enter the authorization code');
    }
};

var step1 = function() {
    var authorizeA = $('#authorize'),
        promise = null;
	authorizeA.hide();
    //console.log('step1');
    if (!localStorage.getItem('oauth_token')) {
        //console.log(localStorage.getItem('oauth_token'));
        $.mobile.showPageLoadingMsg("a", "Loading ...");
        promise = request_token();
        promise.done(function() {
            step2();
        }).fail(function() {
            alert('Conection error');
        }).always(function() {
            $.mobile.hidePageLoadingMsg();
        });
    } else {
        step2();
    }
    return promise;
};

var step2 = function() {
    //console.log('step2');
    $('#auth_html').show();

    if (!localStorage.getItem('oauth_verifier')) {
        var authorizeA = $('#authorize');
        //console.info(getConsumerInfo().serviceProvider.authorize_url+'?oauth_token='+localStorage.getItem('oauth_token'));
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
        resetAccessor();
        document.location.href = '#index';
    })
    .fail(function() {
        alert('Logout failed, try again');
    });
};
