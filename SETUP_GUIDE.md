# CNC Management Dashboard - Setup Guide

## 🚀 Quick Start for New Installations

When you first run the CNC Management Dashboard, you'll be greeted with a setup wizard that helps you configure the system for your specific environment.

## � Administrative Configuration

After initial setup, administrators can access **Admin Settings** for ongoing configuration management:

- **Access**: Available to admin users via the sidebar
- **Features**: Complete feature parity with the Setup Wizard
- **Layout**: Vertical sidebar layout with settings and logout options
- **Capabilities**: Modify company information, module settings, storage paths, and features

### Admin Settings vs Setup Wizard
- **Setup Wizard**: First-time configuration for new installations
- **Admin Settings**: Ongoing configuration management for existing installations
- **Feature Parity**: Both provide the same configuration options
- **UI Consistency**: Matching Auto/Manual button styling and conditional display

## �📋 Setup Wizard Overview

### Step 1: Company Information
- **Company Name**: Your organization's name (will appear in the dashboard header)
- **Company Logo**: Optional logo URL or file path

### Step 2: Module Configuration
Configure which applications you want to use:

#### JSON File Analyzer
- **Purpose**: Automated processing and analysis of manufacturing JSON files
- **Mode Options**:
  - **Integrated**: Part of the main dashboard
  - **Standalone**: Separate application view
- **Data Path**: Where JSON files and results are stored

#### Matrix Tools Manager  
- **Purpose**: Tool inventory management and project tracking
- **Mode Options**:
  - **Integrated**: Part of the main dashboard
  - **Standalone**: Separate application view
- **Data Path**: Where tool data and projects are stored

#### Plates Manager
- **Purpose**: Clamping plate lifecycle management
- **Mode Options**:
  - **Integrated**: Part of the main dashboard
  - **Standalone**: Separate application view
- **Data Path**: Where plate data is stored

### Step 3: Authentication Setup
Choose how users will log into the system:

#### File-based Authentication (Recommended for small teams)
- Store user credentials in a JSON file
- Easy to manage and backup
- Supports CSV import for bulk user creation
- **Template provided** for easy setup

#### Database Authentication
- Connect to an existing database
- Suitable for larger organizations
- Requires database connection string

#### LDAP/Active Directory
- Integrate with existing company directory
- Single sign-on capability
- Requires LDAP server configuration

### Step 4: Storage Paths
Configure where data is stored:
- **Logs Path**: Application logs and audit trails
- **Backup Path**: Automatic backups of data
- **Temporary Files**: Staging area for file processing

### Step 5: Features
Enable additional functionality:
- **Dark Mode**: Default theme preference
- **Notifications**: System alerts and updates
- **Auto Backup**: Daily automatic data backup
- **Export Reports**: PDF/Excel report generation

## 📁 Directory Structure After Setup

```
your-project/
├── config/
│   ├── employees.json          # User accounts (if file-based auth)
│   └── app.config.json         # Application configuration
├── data/
│   ├── json_analyzer/          # JSON file processing data
│   ├── matrix_tools/           # Tool inventory and projects
│   ├── plates_manager/         # Plate tracking data
│   └── backups/               # Automatic backups
├── logs/
│   ├── application.log         # Application logs
│   ├── audit.log              # User activity logs
│   └── errors.log             # Error logs
└── temp/                      # Temporary processing files
```

## 👥 User Management

### Default Accounts
After setup, you'll have access to these default accounts:
- **Admin**: `admin` / `admin123`
- **Operator**: `operator` / `operator123`

### Adding Users

#### Method 1: CSV Import (Recommended)
1. Download the employee template from the setup wizard
2. Fill in user information:
   ```csv
   username,password,role,firstname,lastname,email,department,machineaccess,shiftcodes
   john.smith,password123,user,John,Smith,john@company.com,Production,CNC-001;CNC-002,DAY
   ```
3. Import the CSV file through the setup wizard

#### Method 2: Manual JSON Edit
Edit `config/employees.json`:
```json
{
  "id": "user123",
  "username": "john.smith",
  "password": "password123",
  "role": "user",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@company.com",
  "department": "Production",
  "machineAccess": ["CNC-001", "CNC-002"],
  "shiftCodes": ["DAY"],
  "permissions": {
    "jsonAnalyzer": {"read": true, "write": true, "admin": false},
    "matrixTools": {"read": true, "write": false, "admin": false},
    "platesManager": {"read": true, "write": true, "admin": false}
  }
}
```

### User Roles
- **admin**: Full access to all features and settings
- **supervisor**: Read/write access, limited admin functions
- **user**: Basic read/write access to assigned modules

## 🔧 Module Configuration

### JSON File Analyzer Setup
1. Choose your data path (e.g., `./data/json_analyzer`)
2. Enable auto-processing if desired
3. The system will create necessary subdirectories:
   - `incoming/` - Files to be processed
   - `processed/` - Completed analyses
   - `failed/` - Files that couldn't be processed

### Matrix Tools Manager Setup
1. Set data path for tool inventory
2. Choose inventory file location
3. Import existing tool data if available

### Plates Manager Setup
1. Configure plate database location
2. Set data path for plate tracking
3. Import existing plate data if available

## 📊 Data Migration

### From Other Systems
The setup wizard supports importing data from:
- **CSV files** for user accounts
- **JSON files** for plates, tools, and projects
- **Configuration files** from other installations

### Data Templates
Download templates for:
- Employee data (CSV/JSON)
- Plate inventory (JSON)
- Tool inventory (JSON)
- Project data (JSON)

## 🔒 Security Considerations

### File Permissions
Ensure the application has:
- **Read/Write** access to data directories
- **Read/Write** access to logs directory
- **Read** access to configuration files

### Password Security
- Change default passwords immediately
- Use strong passwords for all accounts
- Consider enabling password complexity requirements

### Backup Strategy
- Enable auto-backup in setup
- Regularly test backup restoration
- Store backups in secure location

## 🛠️ Troubleshooting

### Common Setup Issues

#### Permission Errors
```
Error: EACCES: permission denied
```
**Solution**: Check directory permissions, run with appropriate privileges

#### Configuration Not Saving
```
Error: Failed to save configuration
```
**Solution**: Check browser local storage limits, clear cache if needed

#### Module Not Loading
```
Error: Module failed to initialize
```
**Solution**: Verify data paths exist and are accessible

### Reset Configuration
To reset and run setup again:
1. Clear browser local storage
2. Delete `config/app.config.json`
3. Refresh the application

## 📞 Support

For additional help:
1. Check the main README.md for technical details
2. Review ARCHITECTURE.md for component information
3. Consult AI_AGENT_HANDOFF.md for development context

---

**Setup Version**: 1.0  
**Last Updated**: November 3, 2025