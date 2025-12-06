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
    date: "Date",
    time: "Time",
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
    date: "తేదీ",
    time: "సమయం",
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
  const thukam = parseFloat(document.getElementById("thukam").value) || 70;
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
    num.toLocaleString("en-IN", { minimumFractionDigits: 0 },{maximumFractionDigits: 2});

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

        <h4 style="text-align:center; margin-bottom: 20px">${t.title}</h4>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
  <p style="margin:0;line-height:1.3; align-self:center;">
    <strong>${t.name}:</strong>
    ${farmerName || (currentLang === "te" ? "రైతు" : "Farmer")}
  </p>

  <div style="text-align:right;font-size:12px;line-height:1.2;margin-top:2px;">
    <div><strong>${t.date}:</strong> ${formattedDate}</div>
    <div><strong>${t.time}:</strong> ${formattedTime}</div>
  </div>
</div>
        <hr>

        <p><strong>${t.thukam}(${thukam} kgs):</strong> ${bags} . ${kgs} kgs</p>

        <p><strong>${t.ament} (${ament} kgs):</strong>
        ${total_bags} . ${remaining_kgs} kgs</p>

        <p><strong>${t.rate}:</strong> ₹${formatMoney(cost)} / bag</p>

        <p style="color:#0d6efd;"><strong>${
          t.totalAmount
        }:</strong> ₹${formatMoney(total_amount)}</p>
        
        

        <p style="color:${advance > 0 ? "#dc3545" : "#6c757d"};">
  <strong>${t.advance}:</strong> ₹${formatMoney(advance)}
</p>

<p style="color:${jattuki > 0 ? "#dc3545" : "#6c757d"};">
  <strong>${t.jattuki}:</strong> ₹${formatMoney(jattuki)}
</p>


        <hr>
        <p style="color:#198754;"><strong>${
          t.finalAmount
        }:</strong> ₹${formatMoney(balance_amount)}</p>
    </div>
    
    
    <button id="downloadBtn"
    onclick="downloadReceipt()">${t.download}</button>
    <button id="shareBtn" onclick="shareReceipt()">WhatsApp Share</button>
    `;
    // scroll to receipt after create
setTimeout(() => {
  document.getElementById("result").scrollIntoView({ behavior: "smooth" });
}, 100);

}

const now = new Date();

const formattedDate = now.toLocaleDateString("en-IN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const formattedTime = now.toLocaleTimeString("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

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
  const receipt = document.getElementById("receipt");
  if (!receipt) return;

  const farmerName =
    document.getElementById("farmerName").value ||
    (currentLang === "te" ? "రైతు" : "Farmer");

  const paidBtn = document.getElementById("paidBtn");

  // hide paid button temporarily so it won't show in image
  if (paidBtn) paidBtn.style.display = "none";

  const message =
    currentLang === "te"
      ? `పేరు: ${farmerName}\nరసీదు వివరాలు`
      : `Receipt for ${farmerName}\nPlease find the receipt details`;

  html2canvas(receipt).then((canvas) => {
    // show paid button back in UI
    if (paidBtn) paidBtn.style.display = "inline-block";

    canvas.toBlob(async (blob) => {
      if (!blob) {
        // fallback: only text to WhatsApp
        const whatsappUrl =
          "https://wa.me/?text=" + encodeURIComponent(message);
        window.open(whatsappUrl, "_blank");
        return;
      }

      const file = new File(
        [blob],
        farmerName.replace(/\s+/g, "_") + "_receipt.png",
        { type: "image/png" }
      );

      // ✅ If browser supports sharing files (mobile Chrome, etc.)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            text: message,
            title: "Receipt",
          });
        } catch (err) {
          // user cancelled or error → fallback to text-only WhatsApp
          const whatsappUrl =
            "https://wa.me/?text=" + encodeURIComponent(message);
          window.open(whatsappUrl, "_blank");
        }
      } else {
        // ❌ Desktop or unsupported browser → text-only WhatsApp
        const whatsappUrl =
          "https://wa.me/?text=" + encodeURIComponent(message);
        window.open(whatsappUrl, "_blank");
      }
    });
  });
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
window.onload = () => {
  toggleLanguage();

  // Register service worker for PWA
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js")
      .catch((err) => console.log("SW registration failed:", err));
  }
};
