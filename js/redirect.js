var filter = { urls: ["<all_urls>"], types: ["main_frame"] };
var opt_extraInfoSpec = ["blocking"];

chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		var patternSite, patternRdr, redirectUrl;
		var redirects = JSON.parse(localStorage.getItem('redirects') ||'[]');
		
		for (var i = 0; i < redirects.length; i++) {
			var site = redirects[i][0];
			var redirect = redirects[i][1];
			
			try {
				patternSite = new RegExp(site, 'ig');
				patternRdr = new RegExp(redirect, 'ig');
			} catch(err) {
				continue;
			}
			
			matchSite = details.url.match(patternSite);
			matchRdr = details.url.match(patternRdr);
			if (matchSite) {
				if (!matchRdr) {
					redirectUrl = details.url.replace(patternSite, redirect);
				}
				if (redirectUrl != details.url) {
					return {redirectUrl: redirectUrl};
				}
			}
		}
		return {};
	},
	filter,
	opt_extraInfoSpec
);
