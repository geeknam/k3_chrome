
try {
    var product_name = document.querySelectorAll(".product-main-info h1")[0].innerText;
    var price = document.querySelectorAll(".product-main-info .price")[0].innerText.slice(1);
    $.getJSON(SEARCH_API_URL + '?keywords=' + product_name, function(data){
        if(data.objects.length) {
            var product = data.objects[0];
            if(product.your_price < price) {
                chrome.runtime.sendMessage(product, function(response) {
                    console.log(response);
                });
            }
        }
    });

} catch (error) {
    console.log(error);
}