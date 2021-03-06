// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Simple extension to replace lolcat images from
// http://icanhascheezburger.com/ with loldog images instead.

function bin2String(array) {
    var result = "";
    for (var i = 0; i < array.byteLength; i++) {
        result += String.fromCharCode(parseInt(array[i]));
    }
    return result;
}

chrome.webRequest.onBeforeRequest.addListener(
  function(data) {
    console.log("Vend HQ request intercepted: " + data.url);
    if (data.requestBody != null && data.requestBody.raw != null) {
        var data = new Uint8Array(data.requestBody.raw[0].bytes);
        var salestring = bin2String(data);
        var sale = $.parseJSON(salestring);
        if (sale.register_sale_payments.length > 0) {
            var registerSale = sale.register_sale_payments[sale.register_sale_payments.length - 1];

            if (registerSale.payment_type_id == 1) {
                console.log("Forwarding request " + salestring);
                var request = jQuery.get("https://localhost/VendHook/api/OpenRegister")
            }
        }
		// jQuery.post("https://localhost/VendHook/api/RegisterSale", data.requestBody, function () {
		jQuery.post("https://localhost/VendHook/api/RegisterSale", sale.stringify(), function () {
			console.log("Success");
		}		
    }
    return { cancel: false };
  },
  {
    urls: [
      "*://*.vendhq.com/*"
    ],
    types: ["xmlhttprequest", "object"]
  },
  ["requestBody", "blocking"]
);
