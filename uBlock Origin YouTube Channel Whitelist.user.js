// ==UserScript==
// @name         YouTube - whitelist channels in uBlock Origin
// @namespace    https://github.com/gorhill/uBlock
// @version      1.5
// @description  To whitelist YouTube channels in uBlock Origin
// @author       Raymond Hill (gorhill)
// @match        https://*.youtube.com/watch*
// @grant        none
// @license      http://creativecommons.org/licenses/by-sa/4.0/
// @supportURL   https://github.com/gorhill/uBlock/issues
// ==/UserScript==

// First page load
//

var exposeUserInURL = function() {
    'use strict';

    var link = document.querySelector('[id="watch7-user-header"] a[href^="/user/"]');
    if ( link === null ) {
       return;
    }
    var linkHref = link.getAttribute('href');
    var linkmatch = linkHref.match(/\/user\/(.+)/);
    if (linkmatch === null)
        return;
    var channelId = linkmatch[1];

    var newArg = channelId !== '' ? 'user=' + encodeURIComponent(channelId) : '';
    var matches = location.search.match(/(?:[?&])(user=(?:[^&]+|$))/);
    var oldArg = matches !== null ? matches[1] : '';
    if ( newArg === oldArg ) {
        return;
    }
    var href = location.href;
    if ( oldArg === '' ) {
        location.replace(href + (location.search === '' ? '?' : '&') + newArg);
        return;
    }
    location.replace(href.replace(oldArg, newArg));
};

setTimeout(exposeUserInURL, 25);

// DOM modifications

var mutationHandlerTimer = null;

var mutationHandlerAsync = function() {
    'use strict';

    mutationHandlerTimer = null;
    exposeUserInURL();
};

var mutationHandler = function(mutations) {
    'use strict';

    if ( mutationHandlerTimer !== null ) {
        return;
    }

    for ( var i = 0; i < mutations.length; i++ ) {
        if ( mutations[i].addedNodes ) {
            mutationHandlerTimer = setTimeout(mutationHandlerAsync, 25);
            break;
        }
    }
};

var observer = new MutationObserver(mutationHandler);
observer.observe(document.body, { childList: true, subtree: true });
