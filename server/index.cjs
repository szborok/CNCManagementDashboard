const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3004; // Dashboard backend on 3004, vite on 3000

// Middleware
app.use(cors());
app.use(express.json());

// Path to unified config in BRK_CNC_CORE
const CONFIG_PATH = path.join(__dirname, "../../BRK_CNC_CORE/BRK_SETUP_WIZARD_CONFIG.json");

// Ensure BRK_CNC_CORE directory exists
async function ensureConfigDirectory() {
  const configDir = path.dirname(CONFIG_PATH);
  try {
    await fs.mkdir(configDir, { recursive: true });
  } catch (error) {
    console.error("Failed to create config directory:", error);
  }
}

// GET /api/config - Load configuration
app.get("/api/config", async (req, res) => {
  try {
    const configData = await fs.readFile(CONFIG_PATH, "utf8");
    const config = JSON.parse(configData);
    console.log("✅ Config loaded from filesystem");
    res.json(config);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("⚠️ Config file not found - first time setup required");
      res.status(404).json({ 
        error: "Configuration not found",
        firstTimeSetup: true 
      });
    } else {
      console.error("❌ Failed to load config:", error);
      res.status(500).json({ error: "Failed to load configuration" });
    }
  }
});

// POST /api/config/save - Save configuration
app.post("/api/config/save", async (req, res) => {
  try {
    await ensureConfigDirectory();
    const config = req.body;
    
    // Add server-side metadata
    config.savedAt = new Date().toISOString();
    config.savedBy = "Dashboard";
    
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
    console.log("✅ Config saved to filesystem:", CONFIG_PATH);
    
    res.json({ 
      success: true, 
      message: "Configuration saved successfully",
      path: CONFIG_PATH
    });
  } catch (error) {
    console.error("❌ Failed to save config:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to save configuration" 
    });
  }
});

// DELETE /api/config/reset - Reset configuration
app.delete("/api/config/reset", async (req, res) => {
  try {
    // Archive config file if it exists
    const archiveDir = path.join(path.dirname(CONFIG_PATH), "config_archive");
    await fs.mkdir(archiveDir, { recursive: true });
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const archivePath = path.join(archiveDir, `BRK_SETUP_WIZARD_CONFIG.backup_${timestamp}.json`);
      
      // Try to copy to archive before deleting
      await fs.copyFile(CONFIG_PATH, archivePath);
      console.log(`📦 Config archived to: ${archivePath}`);
    } catch (archiveError) {
      if (archiveError.code !== "ENOENT") {
        console.warn("⚠️ Failed to archive config:", archiveError.message);
      }
    }
    
    // Delete the config file
    await fs.unlink(CONFIG_PATH);
    console.log("✅ Config file deleted - reset to first-time setup");
    res.json({ 
      success: true, 
      message: "Configuration reset successfully" 
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("⚠️ Config file already deleted");
      res.json({ 
        success: true, 
        message: "Configuration already reset" 
      });
    } else {
      console.error("❌ Failed to reset config:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to reset configuration" 
      });
    }
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    service: "BRK CNC Dashboard",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🎯 BRK CNC Dashboard Backend running on http://localhost:${PORT}`);
  console.log(`📁 Config path: ${CONFIG_PATH}`);
});
