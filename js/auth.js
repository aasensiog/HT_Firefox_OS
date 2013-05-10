
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
      check_token_url: base_url+'check_token.ashx',
      invalidate_token_url: base_url+'invalidate_token.ashx'
    }
  };

  return consumer;
};

var accessor = {
  consumerSecret: getConsumerInfo().consumerSecret,
  consumerKey: getConsumerInfo().consumerKey
};

/**
* url
* callback {
*   success,
*   error
* }
}
*/
var doXhrCall = function(url, callback) {
  var xhr = new XMLHttpRequest({
    mozSystem: true
  });

  xhr.open("GET", url, true);

  xhr.onreadystatechange = function () {
      if (xhr.status === 200 && xhr.readyState === 4) {
          callback.success(xhr.response);
      }
  };
  xhr.onerror = function () {
      callback.error();
  };
  alert('sending');
  xhr.send();
};


var request_token = function() {
  var deferred = $.Deferred();
  var consumer = getConsumerInfo();

  var message = {
    action: consumer.serviceProvider.request_token_url,
    method: consumer.serviceProvider.method,
    parameters: {
      oauth_callback: 'oob'
    }
  };

  OAuth.completeRequest(message, accessor);
  url = message.action + '?' + OAuth.formEncode(message.parameters);

  doXhrCall(url, {
    success: function(response) {
      var params = OAuth.getParameterMap(response);
      console.log(params);
      for (var key in params) {
        localStorage[key]=params[key];
      }
      deferred.resolve();
    },
    error: function() {
      alert('Error getting:'+message.action);
      deferred.reject();
    }
  });
  return deferred.promise();
};

var getAccessToken = function() {
  var deferred = $.Deferred();
  var consumer = getConsumerInfo();
  $.extend(true, accessor, {
    token: localStorage['oauth_token']
  });

  var message = {
    action: consumer.serviceProvider.acces_token_url,
    method: consumer.serviceProvider.method,
    parameters: {
      oauth_verifier: localStorage['oauth_verifier']
    }
  };

  OAuth.completeRequest(message, accessor);
  url = message.action + '?' + OAuth.formEncode(message.parameters);

  alert("doing call: "+ url);

  doXhrCall(url, {
    success: function(response) {
      alert('success');
      var params = OAuth.getParameterMap(response);
      console.log(params.oauth_token);
      console.log(params.oauth_token_secret);
      deferred.resolve();
    },
    error: function() {
      alert('Error getting:'+message.action);
      deferred.reject();
    }
  });
  return deferred.promise();
};
