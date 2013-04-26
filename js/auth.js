
/*
var accessor = {
    //token: 'DDWFtJRH1Lb1GNTC',
    //tokenSecret: 'VD6vofdOCG795Lwq',
    consumerKey : "I7YbVQstMasUCioQvQE19K",
    consumerSecret: "Uc6kND7rrRdKj5JzAC1qbx2zdjMAxiq3mhPhjEpvvMN"
};
*/
oauth_explorer_proxy_url = '';

function getConsumerInfo() {
  var base_url = 'https://chpp.hattrick.org/oauth/';

  var consumer = {
    consumerKey: 'I7YbVQstMasUCioQvQE19K',
    consumerSecret: "Uc6kND7rrRdKj5JzAC1qbx2zdjMAxiq3mhPhjEpvvMN",

    serviceProvider: {
      method: 'GET',
      signatureMethod: 'HMAC-SHA1',
      request_token_url: base_url+'request_token.ashx',
      authorize_url: base_url+'authorize.aspx',
      authenticate_url: base_url+'authenticate.aspx',
      acces_token_url: base_url+'access_token.ashx',
      check_token_url: base_url+'access_token.ashx',
      invalidate_token_url: base_url+'check_token.ashx'
    }
  };

  return consumer;
}

//var oauth_verifier = 'FDgxPuLb8RpLx3EF';


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
  var consumer = getConsumerInfo();
  var message = {
    action: consumer.serviceProvider.request_token_url,
    method: null, //consumer.serviceProvider.method,
    parameters: {
      oauth_callback: 'oob'
    }
  };
  var accessor = {
    consumerSecret: consumer.consumerSecret,
    consumerKey: consumer.consumerKey
  };

  doOAuthCall(message, accessor, function(data, textStatus) {
    var list = OAuth.getParameterMap(OAuth.decodeForm(data));
    console.info(list);
    console.info(textStatus);
  });
};

function doOAuthCall( message, accessor, oncmp ) {

  OAuth.completeRequest(message, accessor);

  var ah = OAuth.getAuthorizationHeader('OAuth', message.parameters );
  var cg = OAuth.addToURL( message.action, message.parameters );

  if( oauth_explorer_proxy_url == '' ) {
    jQuery.ajaxSetup({
      'error': function(req, err) { oncmp(req.responseText, err); },
      'success': function(data) { oncmp(data); }
    });
    jQuery.get( cg, [], oncmp, 'text');
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
