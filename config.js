/**
 * Created by andy.fernandez on 4/13/2016.
 */
var dojoConfig = {
    parseOnLoad: false,
    isDebug: true,
    async: true,
    packages: [{
        name: "app",
        location: location.pathname.replace(/\/[^/]*$/, '') + '/assets/lib/app'
    }]
};