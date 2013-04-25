
var request_token_url = 'https://chpp.hattrick.org/oauth/request_token.ashx';
var authorize_path_url = 'https://chpp.hattrick.org/oauth/authorize.aspx';
var acces_token_url = 'https://chpp.hattrick.org/oauth/access_token.ashx';

var accessor = {
    //token: 'DDWFtJRH1Lb1GNTC',
    //tokenSecret: 'VD6vofdOCG795Lwq',
    consumerKey : "I7YbVQstMasUCioQvQE19K",
    consumerSecret: "Uc6kND7rrRdKj5JzAC1qbx2zdjMAxiq3mhPhjEpvvMN"
};

oauth_explorer_proxy_url = '';

function getConsumerInfo() {
  var base_url = 'https://chpp.hattrick.org/oauth/';
  
  var consumer = {
    consumerKey           : 'I7YbVQstMasUCioQvQE19K',
    consumerSecret        : "Uc6kND7rrRdKj5JzAC1qbx2zdjMAxiq3mhPhjEpvvMN",
    serviceProvider: {
      signatureMethod     : 'HMAC-SHA1',
      requestTokenURL     : request_token_url, 
      userAuthorizationURL  : authorize_path_url,
      accessTokenURL      : acces_token_url,
      revisionA           : true
    }
  };

  return consumer;
}

var oauth_verifier = 'FDgxPuLb8RpLx3EF';


var access_token = function() {
  var url = acces_token_url;
    var message = {
      action: url,
      method: "GET",
      parameters: {
        oauth_verifier: oauth_verifier
      }
    };

    OAuth.completeRequest(message, accessor);
    OAuth.SignatureMethod.sign(message, accessor);
    url = url + '?' + OAuth.formEncode(message.parameters);
    window.location.href = url;
};

var authorize_path = function() {
    var url = authorize_path_url;
    var message = {
      action: url,
      method: 'GET',
      parameters: {

      }
    };

    OAuth.completeRequest(message, accessor);
    var ah = OAuth.getAuthorizationHeader('OAuth', message.parameters );
    console.info(ah);
    OAuth.SignatureMethod.sign(message, accessor);
    url = url + '?' + OAuth.formEncode(message.parameters);
    window.location.href = url;
};


var request_token = function() {
  var url = request_token_url;

  var consumer = getConsumerInfo();

  var message = {
    action: consumer.serviceProvider.requestTokenURL,
    method: "GET",
    parameters: {
      oauth_callback: 'oob'
    }
  };

  var accessor = { 
    consumerSecret: consumer.consumerSecret,
    consumerKey: consumer.consumerKey 
  };
  /* 
  if( consumer.serviceProvider.revisionA ) {
    message.parameters.push(['oauth_callback','oob']);
  }
  */
  doOAuthCall( message, accessor, function( data, textStatus ) {
    var list   = OAuth.getParameterMap( OAuth.decodeForm( data ) );
    alert( list.oauth_token );
    alert( list.oauth_token_secret );
  });
};

function doOAuthCall( message, accessor, oncmp ) {
  OAuth.completeRequest(message, accessor);

  var bs = OAuth.SignatureMethod.getBaseString( message );
  var ah = OAuth.getAuthorizationHeader('OAuth', message.parameters );    
  var cg = OAuth.addToURL( message.action, message.parameters );
  
  if( oauth_explorer_proxy_url == '' ) {
    jQuery.ajaxSetup({
      'beforeSend': function(xhr) {
        xhr.setRequestHeader("Authorization", ah)
      },
      'error': function(req, err) { oncmp(req.responseText, err ) }
    });
    jQuery.get( message.action, [], oncmp, 'text');
  } else {
    jQuery.ajaxSetup({
      'beforeSend': function(xhr) {
        xhr.setRequestHeader("X-Forward-Url", message.action);
        xhr.setRequestHeader("Authorization", ah);
      },
      'error': function(req, err) { oncmp(req.responseText, err ) }
    });
    jQuery.get( oauth_explorer_proxy_url, [], oncmp, 'text');
  }
}
