# JSONScanner Renaming Instructions

## Overview

All documentation and configuration files have been updated to reflect the rename from `json_scanner` to `JSONScanner`. This document outlines the remaining steps to complete the renaming process.

## Completed Updates ✅

### Configuration Files

- ✅ `package.json` - Updated all script references
- ✅ `config/unified.config.ts` - Updated module paths and references
- ✅ `src/services/TestDataDownloadService.ts` - Updated package definitions

### Documentation Files

- ✅ `REPOSITORY_ARCHITECTURE.md` - Updated all references
- ✅ `INTEGRATION_SETUP.md` - Updated setup instructions
- ✅ `test_data_samples/README.md` - Updated filenames and references
- ✅ `README.md` - Updated project structure documentation

### Component Files

- ✅ `src/components/SetupWizard.tsx` - Updated function parameters and calls

## Remaining Tasks 🔄

### 1. Physical Folder Renaming

The actual `modules/` folder structure needs to be created when implementing:

```bash
# Current structure (when implementing submodules):
modules/
├── json_scanner/     # Rename this to JSONScanner/
├── ToolManager/      # Keep as is
└── ClampingPlateManager/  # Keep as is

# Target structure:
modules/
├── JSONScanner/      # New name
├── ToolManager/      # Unchanged
└── ClampingPlateManager/  # Unchanged
```

### 2. Git Repository Renaming

When the json_scanner project has its own repository, rename it:

```bash
# On GitHub/GitLab:
# 1. Go to repository settings
# 2. Rename from "json_scanner" to "JSONScanner"
# 3. Update clone URLs in documentation if needed

# Local repository rename:
git remote set-url origin https://github.com/your-org/JSONScanner.git
```

### 3. Module Integration Commands

Updated commands to use after renaming:

```bash
# Setup JSONScanner module
npm run setup:json-scanner  # Points to modules/JSONScanner/

# Development
npm run dev:json-scanner    # Runs from modules/JSONScanner/

# Testing
npm run test:json-scanner   # Tests modules/JSONScanner/
```

## File Structure After Renaming

```
CNCManagementDashboard/
├── modules/
│   ├── JSONScanner/           # ← Renamed from json_scanner
│   │   ├── src/
│   │   ├── test_data/        # Keep all test data
│   │   ├── rules/
│   │   └── package.json
│   ├── ToolManager/          # Unchanged
│   └── ClampingPlateManager/ # Unchanged
├── config/
│   └── unified.config.ts     # ✅ Updated
├── src/
│   ├── components/
│   │   └── SetupWizard.tsx   # ✅ Updated
│   └── services/
│       └── TestDataDownloadService.ts  # ✅ Updated
└── package.json              # ✅ Updated
```

## Verification Steps

After completing the physical renaming:

1. **Test Module Setup**

   ```bash
   npm run setup:json-scanner
   ```

2. **Test Development Server**

   ```bash
   npm run dev:json-scanner
   ```

3. **Test Integration**

   ```bash
   npm run dev:all
   ```

4. **Verify Test Data Download**
   - Start the setup wizard
   - Try downloading JSONScanner test data
   - Confirm filename is `JSONScanner_test_data.zip`

## Benefits of This Rename

1. **Consistent Naming**: Matches PascalCase convention used by other modules
2. **Better Readability**: More professional appearance in documentation
3. **Improved Clarity**: Clearly indicates this is the JSON scanning/analysis module
4. **Future-Proof**: Prepares for potential TypeScript class naming alignment

## Notes

- All internal functionality remains unchanged
- Test data and sample files are preserved
- API endpoints and configuration logic unchanged
- Only naming conventions and folder structure updated
- Backwards compatibility maintained through configuration
