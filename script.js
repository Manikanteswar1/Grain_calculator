let currentLang = "en";

const receiptText = {
  en: {
    title: "Farmer Receipt",
    name: "Name",
    thukam: "Thukam",
    ament: "Ament",
    rate: "Rate",
    totalAmount: "Total Amount",
    advance: "Advance",
    jattuki: "Jattu ki",
    finalAmount: "Final Amount",
    download: "Download Receipt",
  },
  te: {
    title: "రైతు రసీదు",
    name: "పేరు",
    thukam: "తూకం",
    ament: "ఏమెంట్",
    rate: "ధర",
    totalAmount: "మొత్తం",
    advance: "అడ్వాన్స్",
    jattuki: "జట్టు కీ",
    finalAmount: "చెల్లించాల్సిన మొత్తం",
    download: "రసీదు డౌన్‌లోడ్",
  },
};

function toggleLanguage() {
  currentLang = currentLang === "en" ? "te" : "en";

  // Change all labels/headings/buttons with data-en / data-te
  document.querySelectorAll("[data-en]").forEach((el) => {
    const newText = el.getAttribute(`data-${currentLang}`);
    if (newText) el.textContent = newText;
  });

  // Toggle button text
  const langBtn = document.getElementById("langBtn");
  if (langBtn) {
    langBtn.textContent = currentLang === "en" ? "తెలుగు" : "English";
  }
}

function calculate() {
  const bags = parseInt(document.getElementById("bags").value) || 0;
  const kgs = parseFloat(document.getElementById("kgs").value) || 0;
  const thukam = parseFloat(document.getElementById("thukam").value) || 0;
  const ament = parseFloat(document.getElementById("ament").value) || 75;
  const cost = parseFloat(document.getElementById("cost").value) || 0;
  const advance = parseFloat(document.getElementById("advance").value) || 0;
  const jattuki = parseFloat(document.getElementById("jattuki").value) || 0;
  const farmerName = document.getElementById("farmerName").value;
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
    num.toLocaleString("en-IN", { minimumFractionDigits: 0 });

  const t = receiptText[currentLang] || receiptText.en;

  document.getElementById("result").innerHTML = `
    <div id="receipt" style="border:1px dashed #999;padding:10px;position:relative;">

        <!-- Paid button -->
        <button id="paidBtn"
            type="button"
            class="paid-btn"
            style="position:absolute;top:6px;right:10px;"
            onclick="togglePaid()">Mark Paid</button>

        <!-- Paid stamp -->
        <div id="paidStamp" class="paidStamp" style="display:none;">
            PAID
        </div>

        <h4 style="text-align:center;margin:5px 0;">${t.title}</h4>
        <p><strong>${t.name}:</strong> ${
    farmerName || (currentLang === "te" ? "రైతు" : "Farmer")
  }</p>
        <hr>

        <p><strong>${t.thukam}:</strong> ${bags} . ${kgs} kgs</p>

        <p><strong>${t.ament} (${ament} kgs):</strong>
        ${total_bags} . ${remaining_kgs} kgs</p>

        <p><strong>${t.rate}:</strong> ₹${formatMoney(cost)} / bag</p>

        <p><strong>${t.totalAmount}:</strong> ₹${formatMoney(total_amount)}</p>

        <p><strong>${t.advance}:</strong> ₹${formatMoney(advance)}</p>
        <p><strong>${t.jattuki}:</strong> ₹${formatMoney(jattuki)}</p>

        <hr>
        <p><strong>${t.finalAmount}:</strong> ₹${formatMoney(
    balance_amount
  )}</p>
    </div>
    
    
    <button id="downloadBtn"
    onclick="downloadReceipt()">${t.download}</button>
    <button id="shareBtn" onclick="shareReceipt()">WhatsApp Share</button>
    `;
}


function downloadReceipt() {
  const receipt = document.getElementById("receipt");
  const farmerName =
    document.getElementById("farmerName").value ||
    (currentLang === "te" ? "రైతు" : "Farmer");

  const paidBtn = document.getElementById("paidBtn");

  if (!receipt) return;

  // ✅ hide paid button before capture
  if (paidBtn) paidBtn.style.display = "none";

  html2canvas(receipt).then((canvas) => {
    const link = document.createElement("a");
    link.download = farmerName.replace(/\s+/g, "_") + "_receipt.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    // ✅ show button back after download
    if (paidBtn) paidBtn.style.display = "inline-block";
  });
}

function shareReceipt() {
  const farmerName =
    document.getElementById("farmerName").value ||
    (currentLang === "te" ? "రైతు" : "Farmer");

  const paidBtn = document.getElementById("paidBtn");

  // hide paid button temporarily
  if (paidBtn) paidBtn.style.display = "none";

  const message =
    currentLang === "te"
      ? `పేరు: ${farmerName}\nరసీదు వివరాలు`
      : `Receipt for ${farmerName}\nPlease find the receipt details`;

  const whatsappUrl =
    "https://wa.me/?text=" + encodeURIComponent(message);

  window.open(whatsappUrl, "_blank");

  // show back paid button
  if (paidBtn) paidBtn.style.display = "inline-block";
}


function togglePaid() {
  const stamp = document.getElementById("paidStamp");
  const btn = document.getElementById("paidBtn");
  if (!stamp || !btn) return;

  const isPaid = stamp.style.display === "block";

  if (isPaid) {
    // remove paid
    stamp.style.display = "none";
    btn.textContent = "Mark Paid";
  } else {
    // mark paid
    stamp.style.display = "block";
    btn.textContent = "Not Paid";
  }
}


// set default language on load
window.onload = toggleLanguage;
