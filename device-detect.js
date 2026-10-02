/* =========================================================
   電腦 / 手機自動判斷
   螢幕寬度 <= 768px → 手機版
   螢幕寬度 > 768px → 電腦版
========================================================= */

(function () {

    /* 如果目前已經在 mobile 資料夾，就不要再跳轉 */
    if (window.location.pathname.includes("/mobile/")) {
        return;
    }

    /* 判斷目前頁面 */
    const page =
        window.location.pathname
            .split("/")
            .pop();

    /* 頁面對應 */
    const mobilePages = {

        "index.html": "mobile/index.html",

        "help.html": "mobile/help.html",

        "all-foods.html": "mobile/all-foods.html",

        "dessert.html": "mobile/dessert.html",

        "fruit.html": "mobile/fruit.html",

        "rice.html": "mobile/rice.html",

        "noodles.html": "mobile/noodles.html",

        "mantou.html": "mobile/mantou.html",

        "bao.html": "mobile/bao.html",

        "seafood.html": "mobile/seafood.html",

        "vegetable.html": "mobile/vegetable.html"

    };

    /* 只有手機才跳到 mobile */
    if (
        window.innerWidth <= 768 &&
        mobilePages[page]
    ) {

        window.location.href =
            mobilePages[page];

    }

})();
