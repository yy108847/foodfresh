// =========================
// 食物資料儲存
// =========================

function saveFood(category) {

    const name = document.getElementById("foodName").value.trim();
    const date = document.getElementById("foodDate").value;
    const expiryDate = document.getElementById("expiryDate").value;

    if (name === "" || date === "" || expiryDate === "") {
        alert("請把品項名稱、日期、到期日都填寫完整！");
        return;
    }

    let foods = JSON.parse(localStorage.getItem("foodItems")) || [];

    const newFood = {
        id: Date.now().toString(),
        category: category,
        name: name,
        date: date,
        expiryDate: expiryDate
    };

    foods.push(newFood);

    localStorage.setItem("foodItems", JSON.stringify(foods));

    alert("資料已儲存！");

    document.getElementById("foodName").value = "";
    document.getElementById("foodDate").value = "";
    document.getElementById("expiryDate").value = "";
}


// =========================
// 計算剩餘天數
// =========================

function getRemainingDays(expiryDate) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);

    expiry.setHours(0, 0, 0, 0);

    const difference = expiry - today;

    return Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );
}


// =========================
// 全部品項
// =========================

function displayAllFoods() {

    const list = document.getElementById("allFoodsList");

    if (!list) {
        return;
    }

    const foods =
        JSON.parse(localStorage.getItem("foodItems")) || [];

    list.innerHTML = "";


    if (foods.length === 0) {

        list.innerHTML = `
            <div class="no-food-message">
                目前還沒有儲存的品項
            </div>
        `;

        return;
    }


    foods.forEach(function(food) {

        const remainingDays =
            getRemainingDays(food.expiryDate);

        let status = "";

        if (remainingDays < 0) {

            status = "已過期";

        } else if (remainingDays === 0) {

            status = "今天到期";

        } else {

            status = "剩 " + remainingDays + " 天";

        }


        const row =
            document.createElement("div");

        row.className = "food-row";


        row.innerHTML = `

            <div class="food-row-name">
                ${food.name}
            </div>

            <div class="food-row-date">
                ${food.date} → ${food.expiryDate}
            </div>

            <div class="food-row-status">
                ${status}
            </div>

            <button
                class="food-delete-button"
                onclick="deleteFood('${food.id}')">
                刪除
            </button>

        `;


        list.appendChild(row);

    });
}


// =========================
// 刪除品項
// =========================

function deleteFood(id) {

    let foods =
        JSON.parse(localStorage.getItem("foodItems")) || [];

    foods = foods.filter(function(food) {
        return String(food.id) !== String(id);
    });

    localStorage.setItem(
        "foodItems",
        JSON.stringify(foods)
    );

    displayAllFoods();
}


// =========================
// 開啟新增視窗
// =========================

function openAddFood() {

    const modal =
        document.getElementById("addFoodModal");

    if (!modal) {
        return;
    }

    modal.style.display = "flex";


    const today = new Date();

    const todayString =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");


    const dateInput =
        document.getElementById("addFoodDate");

    if (dateInput) {
        dateInput.value = todayString;
    }
}


// =========================
// 關閉新增視窗
// =========================

function closeAddFood() {

    const modal =
        document.getElementById("addFoodModal");

    if (modal) {
        modal.style.display = "none";
    }
}


// =========================
// 從「全部品項」新增
// =========================

function addFoodFromAll() {

    const category =
        document.getElementById("addCategory").value;

    const name =
        document.getElementById("addFoodName").value.trim();

    const date =
        document.getElementById("addFoodDate").value;

    const expiryDate =
        document.getElementById("addExpiryDate").value;


    if (
        name === "" ||
        date === "" ||
        expiryDate === ""
    ) {
        alert("請把資料填寫完整");
        return;
    }


    let foods =
        JSON.parse(localStorage.getItem("foodItems")) || [];


    const newFood = {

        id: Date.now().toString(),

        category: category,

        name: name,

        date: date,

        expiryDate: expiryDate
    };


    foods.push(newFood);


    localStorage.setItem(
        "foodItems",
        JSON.stringify(foods)
    );


    document.getElementById("addFoodName").value = "";

    document.getElementById("addFoodDate").value = "";

    document.getElementById("addExpiryDate").value = "";


    closeAddFood();

    displayAllFoods();
}


// =========================
// 頁面載入
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // 分類頁：日期自動設定今天
        const dateInput =
            document.getElementById("foodDate");

        if (dateInput) {

            const today = new Date();

            const year =
                today.getFullYear();

            const month =
                String(
                    today.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    today.getDate()
                ).padStart(2, "0");

            dateInput.value =
                `${year}-${month}-${day}`;
        }


        // 全部品項頁：載入資料
        displayAllFoods();

    }
);