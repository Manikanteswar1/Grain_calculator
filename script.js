function calculate() {
    const bags = parseInt(document.getElementById("bags").value) || 0;
    const kgs = parseInt(document.getElementById("kgs").value) || 0;
    const thukam = parseInt(document.getElementById("thukam").value) || 0;
    const ament = parseInt(document.getElementById("ament").value) || 75;
    const cost = parseInt(document.getElementById("cost").value) || 0;
    const advance = parseInt(document.getElementById("advance").value) || 0;
    const jattuki = parseInt(document.getElementById("jattuki").value) || 0;

   

    let total_kgs = (bags * thukam) + kgs;
    let total_bags = Math.floor(total_kgs / ament);
    total_kgs = Math.abs((total_bags * ament) - total_kgs);

    let total_amount = total_bags * cost;
    let kgs_amount = Math.floor((cost / ament) * total_kgs);
    total_amount += kgs_amount;

    let balance_amount = total_amount - advance;
    balance_amount -= jattuki;

    document.getElementById("result").innerHTML = `
        <p><strong>Total Bags:</strong> ${total_bags}.${total_kgs} kgs</p>
        <p><strong>Total Amount:</strong> ₹${total_amount}</p>
        <p><strong>Amount after Advance:</strong> ₹${balance_amount}</p>
    `;
}
