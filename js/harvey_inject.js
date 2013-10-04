
try {
    var product_name = document.querySelectorAll(".product-name")[0].innerText;
    var hn_price = document.querySelectorAll(".price")[0].innerText.slice(1);
    $.getJSON(SEARCH_API_URL + '?keywords=' + product_name, function(data){
        if(data.objects.length) {
            var product = data.objects[0];
            if(product.your_price < hn_price) {
                chrome.runtime.sendMessage(product, function(response) {
                    console.log(response);
                });
            }
        }
    });

} catch (error) {
    console.log(error);
}