/* =========================
   食物資料
========================= */

// 從瀏覽器讀取之前儲存的資料
let foods = JSON.parse(localStorage.getItem("foods")) || [];


/* =========================
   頁面載入
========================= */

document.addEventListener("DOMContentLoaded", function () {

    // 預設今天日期
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    document.getElementById("purchaseDate").value =
        `${year}-${month}-${day}`;

    displayFoods();

});


/* =========================
   新增食物
========================= */

function addFood() {

    const name =
        document.getElementById("foodName").value.trim();

    const category =
        document.getElementById("foodCategory").value;

    const purchaseDate =
        document.getElementById("purchaseDate").value;

    const storageDays =
        Number(document.getElementById("storageDays").value);


    // 檢查資料
    if (name === "") {
        alert("請輸入品項名稱！");
        return;
    }

    if (purchaseDate === "") {
        alert("請選擇購買日期！");
        return;
    }

    if (!storageDays || storageDays <= 0) {
        alert("請輸入正確的保存天數！");
        return;
    }


    // 計算到期日期
    const expiryDate = calculateExpiryDate(
        purchaseDate,
        storageDays
    );


    // 建立新的食物
    const food = {

        id: Date.now(),

        name: name,

        category: category,

        purchaseDate: purchaseDate,

        storageDays: storageDays,

        expiryDate: expiryDate

    };


    // 加入陣列
    foods.push(food);


    // 儲存到瀏覽器
    saveFoods();


    // 更新畫面
    displayFoods();


    // 清空輸入
    document.getElementById("foodName").value = "";

    document.getElementById("storageDays").value = "";


    alert("食物已成功加入！");
}


/* =========================
   計算到期日期
========================= */

function calculateExpiryDate(
    purchaseDate,
    storageDays
) {

    const date = new Date(purchaseDate);

    date.setDate(
        date.getDate() + storageDays
    );


    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");


    return `${year}-${month}-${day}`;
}


/* =========================
   計算剩餘天數
========================= */

function calculateRemainingDays(expiryDate) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const expiry = new Date(expiryDate);

    expiry.setHours(0, 0, 0, 0);


    const difference =
        expiry - today;


    const days =
        Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );


    return days;
}


/* =========================
   判斷食物狀態
========================= */

function getFoodStatus(days) {

    if (days < 0) {

        return {
            text: "❌ 已過期",
            className: "status-expired"
        };

    }


    if (days <= 2) {

        return {
            text: "⚠️ 即將到期",
            className: "status-warning"
        };

    }


    return {
        text: "🟢 保存中",
        className: "status-normal"
    };
}


/* =========================
   顯示食物
========================= */

function displayFoods() {

    const foodList =
        document.getElementById("foodList");


    const filter =
        document.getElementById("filterCategory").value;


    // 清空畫面
    foodList.innerHTML = "";


    // 篩選分類
    let filteredFoods = foods;


    if (filter !== "全部") {

        filteredFoods =
            foods.filter(
                food => food.category === filter
            );

    }


    // 沒有食物
    if (filteredFoods.length === 0) {

        foodList.innerHTML = `
            <div class="empty">
                <h3>📭 目前沒有食物</h3>
                <p>新增食物後會顯示在這裡</p>
            </div>
        `;

        updateStatistics();

        return;
    }


    // 產生食物卡片
    filteredFoods.forEach(function (food) {

        const remainingDays =
            calculateRemainingDays(
                food.expiryDate
            );


        const status =
            getFoodStatus(
                remainingDays
            );


        let remainingText;


        if (remainingDays < 0) {

            remainingText =
                `已過期 ${Math.abs(remainingDays)} 天`;

        }
        else if (remainingDays === 0) {

            remainingText =
                "今天到期";

        }
        else {

            remainingText =
                `剩餘 ${remainingDays} 天`;

        }


        const card =
            document.createElement("div");

        card.className = "food-card";


        card.innerHTML = `

            <h3>${food.name}</h3>

            <span class="category">
                ${food.category}
            </span>

            <div class="food-info">

                <div>
                    📅 購買日期：
                    ${food.purchaseDate}
                </div>

                <div>
                    ⏳ 保存時間：
                    ${food.storageDays} 天
                </div>

                <div>
                    📆 到期日期：
                    ${food.expiryDate}
                </div>

            </div>

            <div class="expiry ${status.className}">
                ${status.text}
                · ${remainingText}
            </div>

            <button
                class="delete-button"
                onclick="deleteFood(${food.id})"
            >
                🗑️ 刪除
            </button>

        `;


        foodList.appendChild(card);

    });


    updateStatistics();
}


/* =========================
   刪除食物
========================= */

function deleteFood(id) {

    const confirmDelete =
        confirm("確定要刪除這項食物嗎？");


    if (!confirmDelete) {
        return;
    }


    foods =
        foods.filter(
            food => food.id !== id
        );


    saveFoods();

    displayFoods();
}


/* =========================
   儲存資料
========================= */

function saveFoods() {

    localStorage.setItem(
        "foods",
        JSON.stringify(foods)
    );

}


/* =========================
   統計資料
========================= */

function updateStatistics() {

    let normal = 0;

    let warning = 0;

    let expired = 0;


    foods.forEach(function (food) {

        const days =
            calculateRemainingDays(
                food.expiryDate
            );


        if (days < 0) {

            expired++;

        }
        else if (days <= 2) {

            warning++;

        }
        else {

            normal++;

        }

    });


    document.getElementById("totalCount").textContent =
        foods.length;

    document.getElementById("normalCount").textContent =
        normal;

    document.getElementById("warningCount").textContent =
        warning;

    document.getElementById("expiredCount").textContent =
        expired;

}