/*
Gets a cookie from specified name, returns value of such cookie.
 */
function getCookie(c_name) {
    let i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x === c_name) {
            return unescape(y);
        }
    }
}
/*
Sets a cookie into specified name with specified value.
 */
function setCookie(doc, cookieName, cookieValue) {
    let nDays = 1
    let today = new Date();
    let expire = new Date();
    expire.setTime(today.getTime() + 3600000 * 24 * nDays);
    doc.cookie = cookieName + "=" + escape(cookieValue)
        + ";expires=" + expire.toGMTString()
        + ";path=/";
}