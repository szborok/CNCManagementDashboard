// Run this in the browser console to reset demo data
console.log("🔄 Resetting demo data...");

// Clear old data
localStorage.removeItem("jsonScannerResults");
localStorage.removeItem("toolManagerResults");
localStorage.removeItem("clampingPlateResults");
localStorage.removeItem("dashboardData");

// Mark as not configured to trigger setup wizard
const config = JSON.parse(localStorage.getItem("cncManagementConfig") || "{}");
config.isConfigured = false;
localStorage.setItem("cncManagementConfig", JSON.stringify(config));

console.log("✅ Demo data reset complete. Reloading...");
window.location.reload();
