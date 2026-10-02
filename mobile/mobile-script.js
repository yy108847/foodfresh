/* =========================================================
   手機版網站 JS
========================================================= */


/* =========================================================
   分類頁：儲存食物
========================================================= */

function saveMobileFood(category) {

    const nameInput = document.getElementById("foodName");
    const dateInput = document.getElementById("foodDate");
    const expiryInput = document.getElementById("expiryDate");

    if (!nameInput || !dateInput || !expiryInput) {
        return;
    }

    const name = nameInput.value.trim();
    const date = dateInput.value;
    const expiryDate = expiryInput.value;

    if (!name) {
        alert("請輸入品項名稱");
        return;
    }

    if (!date) {
        alert("請選擇日期");
        return;
    }

    if (!expiryDate) {
        alert("請選擇到期日");
        return;
    }

    if (expiryDate < date) {
        alert("到期日不能早於日期");
        return;
    }


    /* 讀取原本資料 */

    let foodItems =
        JSON.parse(localStorage.getItem("foodItems")) || [];


    /* 新增資料 */

    const newFood = {

        id: Date.now(),

        category: category,

        name: name,

        date: date,

        expiryDate: expiryDate

    };


    foodItems.push(newFood);


    /* 儲存 */

    localStorage.setItem(
        "foodItems",
        JSON.stringify(foodItems)
    );


    alert("資料已儲存！");


    /* 清空輸入框 */

    nameInput.value = "";
    dateInput.value = "";
    expiryInput.value = "";
}


/* =========================================================
   全部品項：讀取資料
========================================================= */

function loadMobileFoodList() {

    const foodList =
        document.getElementById("foodList");

    /* 如果目前不是全部品項頁面 */
    if (!foodList) {
        return;
    }


    let foodItems =
        JSON.parse(localStorage.getItem("foodItems")) || [];


    foodList.innerHTML = "";


    /* 沒有資料 */

    if (foodItems.length === 0) {

        foodList.innerHTML = `
            <div class="mobile-no-food">
                目前沒有儲存的品項
            </div>
        `;

        return;
    }


    /* 建立每一筆資料 */

    foodItems.forEach(function (item) {

        const row =
            document.createElement("div");

        row.className =
            "mobile-food-item";


        /* 計算剩餘天數 */

        const today = new Date();

        today.setHours(0, 0, 0, 0);


        const expiry =
            new Date(item.expiryDate);

        expiry.setHours(0, 0, 0, 0);


        const difference =
            Math.ceil(
                (expiry - today) /
                (1000 * 60 * 60 * 24)
            );


        let status = "";


        if (difference < 0) {

            status = "已過期";

        } else if (difference === 0) {

            status = "今天到期";

        } else {

            status =
                "剩餘 " +
                difference +
                " 天";
        }


        /* 建立 HTML */

        row.innerHTML = `

            <div class="mobile-food-name">
                ${escapeMobileHTML(item.name || "未命名")}
            </div>

            <div class="mobile-food-category">
                ${escapeMobileHTML(item.category || "-")}
            </div>

            <div class="mobile-food-date">
                ${item.date || "-"}
            </div>

            <div class="mobile-food-expiry">
                ${item.expiryDate || "-"}
            </div>

            <div class="mobile-food-status">
                ${status}
            </div>

            <button
                type="button"
                class="mobile-food-delete"
                onclick="deleteMobileFood(${item.id})">
                刪除
            </button>

        `;


        foodList.appendChild(row);

    });
}


/* =========================================================
   防止文字直接插入 HTML
========================================================= */

function escapeMobileHTML(text) {

    return String(text)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


/* =========================================================
   全部品項：刪除
========================================================= */

function deleteMobileFood(id) {

    let foodItems =
        JSON.parse(localStorage.getItem("foodItems")) || [];


    foodItems =
        foodItems.filter(function (item) {

            return Number(item.id) !== Number(id);

        });


    localStorage.setItem(
        "foodItems",
        JSON.stringify(foodItems)
    );


    /* 重新整理清單 */

    loadMobileFoodList();
}


/* =========================================================
   全部品項：打開新增視窗
========================================================= */

function openMobileAddFood() {

    const modal = document.getElementById("mobileAddModal");

    if (!modal) {
        alert("找不到新增視窗");
        return;
    }

    modal.style.display = "flex";
}


/* =========================================================
   全部品項：關閉新增視窗
========================================================= */

function closeMobileAddFood() {

    const modal =
        document.getElementById("mobileAddModal");


    if (!modal) {
        return;
    }


    modal.style.display = "none";
}


/* =========================================================
   全部品項：新增資料
========================================================= */

function saveMobileAddFood() {

    const nameInput =
        document.getElementById("mobileAddName");

    const categoryInput =
        document.getElementById("mobileAddCategory");

    const dateInput =
        document.getElementById("mobileAddDate");

    const expiryInput =
        document.getElementById("mobileAddExpiry");


    if (
        !nameInput ||
        !categoryInput ||
        !dateInput ||
        !expiryInput
    ) {
        return;
    }


    const name =
        nameInput.value.trim();

    const category =
        categoryInput.value;

    const date =
        dateInput.value;

    const expiryDate =
        expiryInput.value;


    /* 檢查 */

    if (!name) {

        alert("請輸入品項名稱");

        return;
    }


    if (!date) {

        alert("請選擇日期");

        return;
    }


    if (!expiryDate) {

        alert("請選擇到期日");

        return;
    }


    if (expiryDate < date) {

        alert("到期日不能早於日期");

        return;
    }


    /* 取得舊資料 */

    let foodItems =
        JSON.parse(localStorage.getItem("foodItems")) || [];


    /* 建立新資料 */

    const newFood = {

        id: Date.now(),

        category: category,

        name: name,

        date: date,

        expiryDate: expiryDate

    };


    foodItems.push(newFood);


    /* 儲存 */

    localStorage.setItem(
        "foodItems",
        JSON.stringify(foodItems)
    );


    /* 清空 */

    nameInput.value = "";

    dateInput.value = "";

    expiryInput.value = "";


    /* 關閉視窗 */

    closeMobileAddFood();


    /* 更新清單 */

    loadMobileFoodList();
}


/* =========================================================
   全部品項：頁面載入
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadMobileFoodList();

    }
);