// Vehicle icons dictionary with realistic bike image and vector fallbacks
const vehicleIcons = {
  bike: `<img src="bike.png" alt="Bike" style="width: 32px; height: 32px; object-fit: contain; display: block;">`,
  auto: `<svg class="vehicle-icon-svg" viewBox="0 0 48 48" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="14" cy="34" r="6"></circle>
    <circle cx="34" cy="34" r="6"></circle>
    <path d="M8 28l4-14h20l8 14H8z"></path>
    <path d="M18 14v14"></path>
    <path d="M28 14v14"></path>
  </svg>`,
  car: `<svg class="vehicle-icon-svg" viewBox="0 0 48 48" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="13" cy="33" r="5.5"></circle>
    <circle cx="35" cy="33" r="5.5"></circle>
    <path d="M6 31h2m10 0h12m10 0h2"></path>
    <path d="M7 26l5-12h24l5 12"></path>
    <path d="M5 26h38v5H5z"></path>
  </svg>`
};

/**
 * Updates vehicle icon according to ride selection
 */
function onVehicleChange() {
  const type = document.getElementById('vehicleType').value;
  const container = document.getElementById('vehicleIconContainer');
  if (type.toLowerCase().includes('bike') || type.toLowerCase().includes('moto')) {
    container.innerHTML = vehicleIcons.bike;
  } else if (type.toLowerCase().includes('auto')) {
    container.innerHTML = vehicleIcons.auto;
  } else {
    container.innerHTML = vehicleIcons.car;
  }
}

/**
 * Calculates net total fare automatically based on suggested fare & promo
 */
function calcTotals() {
  const suggested = parseFloat(document.getElementById('suggestedFare').value) || 0;
  const promo = parseFloat(document.getElementById('promotionFare').value) || 0;
  const total = Math.max(0, suggested - promo);
  document.getElementById('totalFare').value = total.toFixed(2);
}

/**
 * Calculates suggested fare automatically based on total fare & promo
 */
function calcSuggestedFromTotal() {
  const total = parseFloat(document.getElementById('totalFare').value) || 0;
  const promo = parseFloat(document.getElementById('promotionFare').value) || 0;
  const suggested = total + promo;
  document.getElementById('suggestedFare').value = suggested.toFixed(2);
}

/**
 * Synchronizes all form inputs to the live preview receipt in real-time
 */
function updateReceipt() {
  const riderName = document.getElementById('riderName').value || 'Rider';
  const timeOfDay = document.getElementById('timeOfDay').value;
  const currency = document.getElementById('currencySymbol').value || '₹';
  const suggestedFare = parseFloat(document.getElementById('suggestedFare').value) || 0;
  const promotionFare = parseFloat(document.getElementById('promotionFare').value) || 0;
  const totalFare = parseFloat(document.getElementById('totalFare').value) || 0;
  const showBanner = document.getElementById('showOfferBanner').checked;
  const bannerText = document.getElementById('offerBannerText').value;
  const paymentMethod = document.getElementById('paymentMethod').value;
  const paymentDateTime = document.getElementById('paymentDateTime').value;
  const issuedOnBehalf = document.getElementById('issuedOnBehalf').value;
  const vehicleType = document.getElementById('vehicleType').value;
  const licensePlate = document.getElementById('licensePlate').value;
  const tripDistance = document.getElementById('tripDistance').value;
  const tripDuration = document.getElementById('tripDuration').value;

  // Update Greetings
  document.getElementById('previewGreeting').textContent = `Thanks for riding, ${riderName}`;
  document.getElementById('previewSubgreeting').textContent = `We hope you enjoyed your ride ${timeOfDay}.`;

  // Update Amounts
  document.getElementById('previewTotal').textContent = `${currency}${totalFare.toFixed(2)}`;
  document.getElementById('previewSuggestedFare').textContent = `${currency}${suggestedFare.toFixed(2)}`;
  document.getElementById('previewPaymentAmount').textContent = `${currency}${totalFare.toFixed(2)}`;

  // Promotion Row visibility and text
  const promoRow = document.getElementById('previewPromotionRow');
  if (promotionFare > 0) {
    promoRow.style.display = 'flex';
    document.getElementById('previewPromotionFare').textContent = `-${currency}${promotionFare.toFixed(2)}`;
  } else {
    promoRow.style.display = 'none';
  }

  // Offer Banner visibility and text
  const bannerEl = document.getElementById('previewOfferBanner');
  const bannerInputGroup = document.getElementById('bannerTextInputGroup');
  if (showBanner) {
    bannerEl.style.display = 'flex';
    bannerInputGroup.style.display = 'block';
    document.getElementById('previewBannerText').textContent = bannerText;
  } else {
    bannerEl.style.display = 'none';
    bannerInputGroup.style.display = 'none';
  }

  // Payment Details
  document.getElementById('previewPaymentMethod').textContent = paymentMethod;
  document.getElementById('previewPaymentTime').textContent = paymentDateTime;
  document.getElementById('previewIssuedOnBehalf').textContent = issuedOnBehalf;

  // Trip details
  document.getElementById('previewVehicleType').textContent = vehicleType;
  document.getElementById('previewLicensePlate').textContent = licensePlate;
  document.getElementById('previewTripMetrics').textContent = `${tripDistance}, ${tripDuration}`;
}

/**
 * Resets fields to the original sample values
 */
function resetToSample() {
  document.getElementById('riderName').value = "Rohit";
  document.getElementById('timeOfDay').value = "this morning";
  document.getElementById('showOfferBanner').checked = true;
  document.getElementById('offerBannerText').value = "Congratulations! You have offer on UberMoto.";
  document.getElementById('currencySymbol').value = "₹";
  document.getElementById('suggestedFare').value = "126.32";
  document.getElementById('promotionFare').value = "2.00";
  document.getElementById('totalFare').value = "124.32";
  document.getElementById('paymentMethod').value = "Cash.";
  document.getElementById('paymentDateTime').value = "1/16/26 6:56 AM";
  document.getElementById('issuedOnBehalf').value = "NAVNIT -";
  document.getElementById('vehicleType').value = "Bike Saver";
  document.getElementById('licensePlate').value = "UP16SF4218";
  document.getElementById('tripDistance').value = "10.22 kilometers";
  document.getElementById('tripDuration').value = "32 minutes";
  onVehicleChange();
  updateReceipt();
}

/**
 * Exports the receipt card to a high resolution PDF file, centered on the page
 */
function downloadReceiptPdf() {
  const element = document.getElementById('receiptCard');
  const rider = document.getElementById('riderName').value || 'ride';
  
  // A4 paper is 210mm wide. With element width 595px (157.4mm at 96dpi),
  // a left/right margin of ~12mm perfectly centers the content on the 210mm page.
  const opt = {
    margin: [10, 12, 10, 12],
    filename: `Uber_Receipt_${rider}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const btn = document.getElementById('downloadPdfBtn');
  const originalText = btn.innerHTML;
  btn.innerHTML = 'Generating PDF...';
  btn.disabled = true;

  // Clone or ensure width fills the print canvas cleanly
  html2pdf().set(opt).from(element).save().then(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }).catch(err => {
    console.error('PDF generation error, fallback to print:', err);
    btn.innerHTML = originalText;
    btn.disabled = false;
    window.print();
  });
}

/**
 * Mobile tab switching between form editor and live preview
 */
function switchMobileTab(tab) {
  const editorBtn = document.getElementById('tabEditorBtn');
  const previewBtn = document.getElementById('tabPreviewBtn');
  const mainLayout = document.getElementById('mainLayout');

  if (!editorBtn || !previewBtn || !mainLayout) return;

  if (tab === 'preview') {
    editorBtn.classList.remove('active');
    previewBtn.classList.add('active');
    mainLayout.classList.add('show-preview-mode');
    mainLayout.classList.remove('show-editor-mode');
  } else {
    previewBtn.classList.remove('active');
    editorBtn.classList.add('active');
    mainLayout.classList.add('show-editor-mode');
    mainLayout.classList.remove('show-preview-mode');
  }
}

// Initial setup on document load
document.addEventListener('DOMContentLoaded', () => {
  updateReceipt();
  onVehicleChange();
});
