async function loadTransactions() {

    const response = await fetch("./data/transactions.json");
    const transactions = await response.json();

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
