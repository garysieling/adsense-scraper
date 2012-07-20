var page = require('webpage').create(),
    t, address;

if (phantom.args.length === 0) {
    console.log('Usage: ./run <some URL>');
    phantom.exit();
} else {
    t = Date.now();
    address = phantom.args[0];
    //address = 'http://www.homedepot.com/Building-Materials-Drywall/FibaTape/h_d1/N-5yc1vZar3dZ38m/h_d2/Navigation?catalogId=10053&Nu=P_PARENT_ID&langId=-1&storeId=10051';
    output = phantom.args[1]; 
    page.viewportSize = { width: 600, height: 600 };

    page.onConsoleMessage = function (msg) {
        console.log('Console log: ' + msg);
    };

    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('FAIL to load the address');
            phantom.exit();
        } else {
       
            page.evaluate(function () {
                var parse = function(query) {
                    var vars = query.split("?")[1].split("&");
	            var res = {};
        	    for (var i = 0; i < vars.length; i++) {
                        var pair = vars[i].split("=");
                	res[pair[0]] = unescape(pair[1]);
        	    }
		    return res;
    		};

               console.log(document.title);
		var ads = document.querySelectorAll('#googleAdSenseLeft ul li a');
                for (var i=0; i<ads.length; i++){
		     var adQuery = ads[i].href;
		     var adContents = parse(adQuery);
		     adContents.url = adQuery;
		     adContents.text = ads[i].innerText;
		     console.log(JSON.stringify(adContents));
		}
            });

            t = Date.now() - t;
            console.log('Loading time ' + t + ' msec');
	
	    window.setTimeout(function () {
                page.render(output);
                phantom.exit();
            }, 200);

        }
    });
}
