function calculate() {
  const bags = parseInt(document.getElementById("bags").value) || 0;
  const kgs = parseFloat(document.getElementById("kgs").value) || 0;
  const thukam = parseFloat(document.getElementById("thukam").value) || 0;
  const ament = parseFloat(document.getElementById("ament").value) || 75;
  const cost = parseFloat(document.getElementById("cost").value) || 0;
  const advance = parseFloat(document.getElementById("advance").value) || 0;
  const jattuki = parseFloat(document.getElementById("jattuki").value) || 0;
  const farmerName = document.getElementById("farmerName").value || "Farmer";

  // calculations
  let total_kgs = bags * thukam + kgs;
  total_kgs = +total_kgs.toFixed(2);

  let total_bags = Math.floor(total_kgs / ament);

  let remaining_kgs = total_kgs - total_bags * ament;
  remaining_kgs = +remaining_kgs.toFixed(2);

  let perKgRate = cost / ament;

  let total_amount = total_bags * cost + perKgRate * remaining_kgs;
  total_amount = +total_amount.toFixed(2);

  let balance_amount = total_amount - advance - jattuki;
  balance_amount = +balance_amount.toFixed(2);

  const formatMoney = (num) =>
    num.toLocaleString("en-IN", { minimumFractionDigits: 2 });

  document.getElementById("result").innerHTML = `
    <div id="receipt" style="border:1px dashed #999;padding:10px;">
        <h4 style="text-align:center;margin:5px 0;">Farmer Receipt</h4>
        <p><strong>Name:</strong> ${farmerName}</p>
        <hr>

        <p><strong>Thukam:</strong> ${bags} . ${kgs} kgs</p>

        <p><strong>Ament (${ament} kgs):</strong>
        ${total_bags} bags . ${remaining_kgs} kgs</p>

        <p><strong>Rate:</strong> ₹${formatMoney(cost)} / bag</p>

        <p><strong>Total Amount:</strong> ₹${formatMoney(total_amount)}</p>

        <p><strong>Advance:</strong> ₹${formatMoney(advance)}</p>
        <p><strong>Jattu ki:</strong> ₹${formatMoney(jattuki)}</p>

        <hr>
        <p><strong>Final Amount:</strong> ₹${formatMoney(balance_amount)}</p>
    </div>

    <button id="downloadBtn"
        onclick="downloadReceipt()">Download Receipt</button>
    `;
}

function downloadReceipt() {
  const receipt = document.getElementById("receipt");
  const farmerName = document.getElementById("farmerName").value || "Farmer";

  if (!receipt) return;

  html2canvas(receipt).then((canvas) => {
    const link = document.createElement("a");
    link.download = farmerName.replace(/\s+/g, "_") + "_receipt.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}
