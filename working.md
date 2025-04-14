# Inventory Tracking System Documentation

## Project Overview
This is a barcode-based inventory tracking system that uses Google Apps Script as a backend and React Native for the mobile frontend. The system tracks inventory movements (in/out) and maintains separate sheets for inventory in (II) and inventory out (IO) operations.

## System Architecture

### Backend (Google Apps Script)
- Hosted on Google Apps Script
- Uses Google Sheets as a database
- Handles barcode scanning data
- Manages inventory operations

### Frontend (React Native)
- Mobile application for scanning barcodes
- Separate screens for inventory in and out
- Real-time feedback for scanning operations
- Distributor management for inventory out

## Workflow

### 1. Inventory In Process
1. User opens the app and selects "Inventory In"
2. Camera opens for barcode scanning
3. When a barcode is scanned:
   - Data is parsed from the barcode
   - Checked for duplicates in the II sheet
   - If unique, added to the II sheet
   - User receives success/error feedback

### 2. Inventory Out Process
1. User opens the app and selects "Inventory Out"
2. User enters distributor name
3. Camera opens for barcode scanning
4. When a barcode is scanned:
   - Data is parsed from the barcode
   - Checked for duplicates in the IO sheet
   - If unique, added to the IO sheet with distributor info
   - User receives success/error feedback

## Code Documentation

### Backend (Code.gs)

#### 1. doGet Function
```javascript
function doGet(e) {
  // Handles GET requests to the web app
  // If action=removeDuplicates, calls removeDuplicates function
  // Otherwise returns service status
}
```

#### 2. removeDuplicates Function
```javascript
function removeDuplicates() {
  // Removes duplicate entries from the active sheet
  // Uses a Map to track unique barcodes
  // Preserves header row
  // Returns count of removed duplicates
}
```

#### 3. parseDataMatrix Function
```javascript
function parseDataMatrix(data) {
  // Parses barcode data in DataMatrix format
  // Expected format: batchId~manufacturingDate~timestamp~productInfo~serial1~serial2~serial3~serial4~controlCode
  // Returns structured object with parsed data
}
```

#### 4. doPost Function
```javascript
function doPost(e) {
  // Main function handling barcode scanning data
  // Parameters:
  // - barcode: The scanned barcode data
  // - mode: 'in' or 'out' for inventory operation
  // - distributor: Name of distributor (for inventory out)
  
  // Process:
  // 1. Parse incoming data
  // 2. Select appropriate sheet (II or IO)
  // 3. Check for duplicates
  // 4. Add new entry if unique
  // 5. Return success/error response
}
```

### Frontend Components

#### 1. QRScanner.js
- Handles inventory in scanning
- Features:
  - Camera access and permissions
  - Barcode scanning
  - Duplicate prevention
  - Real-time feedback
  - Navigation

#### 2. QRScannerOut.js
- Handles inventory out scanning
- Features:
  - Camera access and permissions
  - Barcode scanning
  - Distributor information
  - Duplicate prevention
  - Real-time feedback
  - Navigation

#### 3. InventoryOutScreen.js
- Manages distributor input
- Features:
  - Distributor name input
  - Validation
  - Navigation to scanner

#### 4. HomeScreen.js
- Main navigation screen
- Features:
  - Inventory In button
  - Inventory Out button
  - Navigation setup

## Data Structure

### Inventory In Sheet (II)
Columns:
1. Timestamp
2. Batch ID
3. Manufacturing Date
4. Scan Timestamp
5. Product Info
6. Serial Numbers
7. Control Code

### Inventory Out Sheet (IO)
Columns:
1. Timestamp
2. Batch ID
3. Manufacturing Date
4. Scan Timestamp
5. Product Info
6. Serial Numbers
7. Control Code
8. Distributor

## Error Handling

### 1. Duplicate Detection
- Checks for existing batch ID or serial number
- Prevents duplicate entries in both II and IO sheets
- Returns appropriate error messages

### 2. Camera Permissions
- Handles camera access permissions
- Shows permission request UI if needed

### 3. Network Errors
- Handles API communication errors
- Shows user-friendly error messages

### 4. Data Validation
- Validates barcode format
- Validates distributor input
- Ensures data integrity

## Security Considerations

1. Data Validation
   - Input sanitization
   - Format checking
   - Duplicate prevention

2. Access Control
   - Google Apps Script deployment settings
   - Mobile app permissions

3. Data Integrity
   - Consistent data format
   - Error handling
   - Duplicate prevention

## Best Practices

1. Code Organization
   - Modular structure
   - Clear function separation
   - Consistent naming conventions

2. Error Handling
   - Comprehensive error messages
   - User-friendly feedback
   - Graceful failure handling

3. User Experience
   - Real-time feedback
   - Clear navigation
   - Intuitive interface

4. Performance
   - Efficient duplicate checking
   - Optimized data processing
   - Responsive UI

## Maintenance and Updates

1. Regular Tasks
   - Monitor for duplicate entries
   - Check for data consistency
   - Verify sheet structure

2. Updates
   - Add new features
   - Fix bugs
   - Improve error handling
   - Enhance user experience

## Troubleshooting

1. Common Issues
   - Duplicate entries
   - Camera access problems
   - Network connectivity
   - Data format errors

2. Solutions
   - Check for existing entries
   - Verify permissions
   - Check network connection
   - Validate data format 