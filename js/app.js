let sortDescending = true;
let transactionsData = [];

function renderTransactions() {

    const data = [...transactionsData];

    data.sort((a, b) => {
        const d1 = new Date(a.date);
        const d2 = new Date(b.date);

        return sortDescending
            ? d2 - d1
            : d1 - d2;
    });

    document.getElementById("transactions").innerHTML =
        data.map(t => `
            <div class="transaction ${t.type}">
                <div class="icon">
                    ${t.type === "in" ? "↓" : "↑"}
                </div>

                <div>
                    <div class="desc">
                        ${t.note}
                    </div>

                    <div class="date">
                        ${t.date}
                    </div>
                </div>

                <div class="value">
                    ${t.type === "in" ? "+" : "-"}
                    ${new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: "EUR"
                    }).format(t.amount)}
                </div>
            </div>
        `).join("");
}

function toggleSort() {

    sortDescending = !sortDescending;

    document.querySelector(".sort-toggle").textContent =
        sortDescending
            ? "Neueste zuerst ▼"
            : "Älteste zuerst ▲";

    renderTransactions();
}

async function loadTransactions() {

    const response = await fetch("./data/transactions.json");
    const transactions = await response.json();
    //transactionsData = await response.json();
    //renderTransactions();

    const euro = n => new Intl.NumberFormat(
        "de-DE",
        {
            style: "currency",
            currency: "EUR"
        }
    ).format(n);

    const balance = transactions.reduce((sum, item) => {
        return sum + (
            item.type === "in"
            ? item.amount
            : -item.amount
        );
    }, 0);

    document.getElementById("balance").innerText =
        euro(balance);

    const container =
        document.getElementById("transactions");

    container.innerHTML =
        transactions
        .sort((a,b)=>new Date(b.date)-new Date(a.date))
        .map(t => `
            <article class="transaction ${t.type}">
                <div class="icon">
                    ${t.type==="in" ? "↓" : "↑"}
                </div>

                <div>
                    <div class="desc">
                        ${t.note}
                    </div>

                    <div class="date">
                        ${t.date}
                    </div>
                </div>

                <div class="value">
                    ${t.type==="in" ? "+" : "-"}
                    ${euro(t.amount)}
                </div>
            </article>
        `)
        .join("");
}

loadTransactions();
