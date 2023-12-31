// ==UserScript==
// @name         Block Haggle Auto Complete
// @version      1.0
// @description  Block haggle auto complete
// @match        https://www.neopets.com/haggle.phtml*
// @match        https://www.neopets.com/haggle.phtml
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function disableAutocomplete() {
        var inputs = document.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].setAttribute('autocomplete', 'off');
        }
    }
    window.addEventListener('load', disableAutocomplete);
})();
