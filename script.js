let entries = [];
let budgets = {};
let redundancy = 0;
let redundancyLimit = 300;
let savedItems = [];
let savedBudgetItems = [];

// 从 LocalStorage 读取数据并初始化
window.onload = function() {
    let savedEntries = localStorage.getItem('entries');
    if (savedEntries) {
        entries = JSON.parse(savedEntries);
        updateEntryList();
    }

    let savedRedundancyLimit = localStorage.getItem('redundancyLimit');
    if (savedRedundancyLimit) {
        redundancyLimit = parseFloat(savedRedundancyLimit);
        document.getElementById("redundancy-limit-display").textContent = redundancyLimit;
    }

    let savedUserName = localStorage.getItem('userName');
    if (savedUserName) {
        document.getElementById("header-title").textContent = `${savedUserName}的记账系统`;
    }

    let savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
        document.body.style.background = `url('${savedBackground}') no-repeat center center fixed`;
        document.body.style.backgroundSize = 'cover';
    }
};

function addEntry() {
    let item = document.getElementById("item").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let note = document.getElementById("note").value;

    if (item && !isNaN(amount)) {
        if (!savedItems.includes(item)) {
            savedItems.push(item);
        }
        updateItemTags();

        entries.push({ item: item, amount: amount, note: note });

        // 保存到 LocalStorage
        localStorage.setItem('entries', JSON.stringify(entries));

        checkBudgetAndUpdateRedundancy(item);

        updateEntryList();
        updateRedundancyAmount();
        document.getElementById("item").value = '';
        document.getElementById("amount").value = '';
        document.getElementById("note").value = '';
    } else {
        alert("请输入有效的账目和金额");
    }
}

function setBudget() {
    let budgetItem = document.getElementById("budget-item").value;
    let budgetLimit = parseFloat(document.getElementById("budget-limit").value);

    if (budgetItem && !isNaN(budgetLimit)) {
        if (budgets[budgetItem] === undefined) {
            budgets[budgetItem] = budgetLimit;

            if (!savedBudgetItems.includes(budgetItem)) {
                savedBudgetItems.push(budgetItem);
            }
            updateBudgetTags();

            updateBudgetList();
            localStorage.setItem('budgets', JSON.stringify(budgets));
            alert(`已为 ${budgetItem} 设定预算 ¥${budgetLimit}`);
        } else {
            alert("本月预算已设定，无法修改！");
        }

        document.getElementById("budget-item").value = '';
        document.getElementById("budget-limit").value = '';
    } else {
        alert("请输入有效的预算项目和额度");
    }
}

function setRedundancyLimit() {
    let newLimit = parseFloat(document.getElementById("redundancy-limit").value);
    if (!isNaN(newLimit) && newLimit > 0) {
        redundancyLimit = newLimit;
        document.getElementById("redundancy-limit-display").textContent = redundancyLimit;
        localStorage.setItem('redundancyLimit', redundancyLimit); // 保存到 LocalStorage
        alert(`冗余库额度已设置为 ¥${redundancyLimit}`);
    } else {
        alert("请输入有效的冗余库额度");
    }
}

function setUserName() {
    let userName = document.getElementById("user-name").value;
    if (userName.trim() !== "") {
        document.getElementById("header-title").textContent = `${userName}的记账系统`;
        localStorage.setItem('userName', userName); // 保存到 LocalStorage
    } else {
        alert("请输入有效的名字");
    }
}

function setBackgroundImage() {
    let backgroundInput = document.getElementById("background-upload");
    let file = backgroundInput.files[0];

    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            document.body.style.background = `url('${e.target.result}') no-repeat center center fixed`;
            document.body.style.backgroundSize = 'cover';
            localStorage.setItem('backgroundImage', e.target.result); // 保存背景图片到 LocalStorage
        };
        reader.readAsDataURL(file);
    } else {
        alert("请上传有效的图片文件");
    }
}

function updateEntryList() {
    let entryList = document.getElementById("entry-list");
    entryList.innerHTML = '';

    entries.forEach((entry) => {
        let listItem = document.createElement('li');
        listItem.textContent = `${entry.item}: ¥${entry.amount} （备注: ${entry.note}）`;
        entryList.appendChild(listItem);
    });
}

function updateRedundancyAmount() {
    let redundancyAmount = document.getElementById("redundancy-amount");
    redundancyAmount.textContent = redundancy;
}
