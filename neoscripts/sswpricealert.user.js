// ==UserScript==
// @name         Price Only SSW Checker
// @namespace    https://loart.github.io/
// @version      0.1
// @description  Monitors the network during a SSW to get lowest price.
// @author       Loart
// @match        https://www.neopets.com/premi*
// @match        https://www.neopets.com/market.phtml?type=yo*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';
    
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {

        this.addEventListener('load', function() {
            if (this.responseURL.includes('shops/ssw/ssw_query.php') && this.responseURL.includes('priceOnly=1')) {
                console.log('XHR Intercepted:', this.responseURL);
                try {
                    const data = JSON.parse(this.responseText);
                    if (data && data.data && data.data.prices) {
                        const prices = data.data.prices.map(price => parseInt(price, 10));
                        const lowestPrice = Math.min(...prices);
                        console.log('Lowest Price:', lowestPrice);
                        alert(`Lowest Price: ${lowestPrice}`);

                    }
                } catch (err) {
                    console.error('Error parsing response:', err);
                }
            }
        });
        originalSend.call(this, body);
    };
})();
