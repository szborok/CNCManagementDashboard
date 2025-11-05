# Test Data Download Feature

## Overview

The test data download feature allows new users to quickly get started with the CNC Management Dashboard by providing comprehensive sample data for all modules.

## Available Packages

### 1. JSON Scanner Test Data (15 MB)

**Filename:** `JSONScanner_test_data.zip`

**Contents:**

- Complete CAD project structures from real manufacturing scenarios
- W5270NS01001/, W5270NS01003/, W5270NS01060/ - Full project hierarchies
- testPathHumming_auto/ - Automated processing workflow samples
- testPathOne_manual/ - Manual processing examples
- Sample XML files with CAD operation data
- Expected result.json files showing analysis outputs
- folderInfo.txt files with project documentation

**Use Cases:**

- Test JSON file analysis and rule execution
- Validate automatic correction workflows
- Practice with real project structures
- Understand expected output formats

### 2. Tool Manager Test Data (8 MB)

**Filename:** `tool_manager_test_data.zip`

**Contents:**

- Euroform_Matrix_2024-01-15.xlsx - Complete sample matrix file
- sampleExcels/ - Reference files for various tool types
- testJSONs/ - Tool tracking examples and work items
- filesToProcess/ - Ready-to-process sample files
- filesProcessedArchive/ - Examples of processed files
- Tool definitions and configuration examples

**Use Cases:**

- Test Excel matrix file processing
- Practice tool inventory management
- Understand work tracking workflows
- Validate file processing automation

### 3. Clamping Plate Manager Test Data (5 MB)

**Filename:** `clamping_plates_test_data.zip`

**Contents:**

- Készülékek.xlsx - Complete plate inventory database
- Numbered folders (1-38) - Individual plate documentation
- Usage tracking and assignment examples
- Maintenance records and scheduling data
- Photo documentation samples
- Technical specifications and drawings

**Use Cases:**

- Test plate inventory management
- Practice usage tracking and assignment
- Understand maintenance scheduling
- Validate work order integration

## How to Use

### 1. Download from Setup Wizard

1. Start the CNC Management Dashboard setup wizard
2. On the Introduction step, find the "Try It Out - Download Test Data" section
3. Click on the module you want to test
4. Save the downloaded ZIP file to your desired location

### 2. Extract and Configure

1. Extract the downloaded ZIP file
2. Note the folder structure and file locations
3. In the setup wizard, point the application to these sample folders
4. Complete the setup process

### 3. Explore Features

- All modules will work with realistic sample data
- Test complete workflows from data input to analysis
- Generate reports and validate outputs
- Experiment with different settings and configurations

## Integration with Setup Process

The test data download feature is integrated into the setup wizard's Introduction step:

```tsx
// Button example from SetupWizard
<Button
  variant="outline"
  size="sm"
  onClick={() => handleDownloadTestData("JSONScanner")}
>
  <FileJson className="h-4 w-4 mr-2" />
  JSON Analyzer Samples
</Button>
```

## Technical Implementation

### Service Layer

The `TestDataDownloadService` handles:

- Package information and metadata
- Download simulation in development mode
- Actual file downloads in production
- Analytics tracking for download statistics

### Development Mode

In development, the feature shows detailed package information instead of actual downloads, allowing users to understand what would be available.

### Production Mode

In production, the service would:

1. Create ZIP archives from actual test_data directories
2. Serve files through a secure download endpoint
3. Track download analytics for usage insights
4. Provide proper file management and cleanup

## File Structure Expected

When users download and extract test data, they should organize it as follows:

```
chosen_data_directory/
├── JSONScanner_samples/
│   ├── testPathHumming_auto/
│   ├── testPathOne_manual/
│   └── ...
├── tool_manager_samples/
│   ├── filesToProcess/
│   ├── sampleExcels/
│   └── ...
└── clamping_plate_samples/
    ├── 1_alap/
    ├── 10/ ... 38/
    └── Készülékek.xlsx
```

## Benefits for New Users

1. **Immediate Evaluation** - Try all features without preparing data
2. **Learning Tool** - Understand expected file formats and structures
3. **Workflow Testing** - Experience complete end-to-end processes
4. **Configuration Validation** - Ensure setup is working correctly
5. **Training Resource** - Learn the system with realistic examples

## Future Enhancements

- **Selective Downloads** - Choose specific components within packages
- **Version Management** - Multiple versions of test data for different scenarios
- **Custom Datasets** - Industry-specific sample data packages
- **Interactive Tutorials** - Guided tours using the sample data
- **Automatic Updates** - Keep test data current with new features
