// Google Apps Script code for handling barcode scanning
function doGet(e) {
  // Check if this is a removeDuplicates request
  if (e.parameter.action === 'removeDuplicates') {
    return removeDuplicates();
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Service is running'
  })).setMimeType(ContentService.MimeType.JSON);
}

function removeDuplicates() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Create a map to track unique barcodes
    const uniqueBarcodes = new Map();
    const rowsToKeep = [values[0]]; // Keep header row
    
    // Process each row (skip header)
    for (let i = 1; i < values.length; i++) {
      const barcode = String(values[i][1]).trim();
      if (!uniqueBarcodes.has(barcode)) {
        uniqueBarcodes.set(barcode, true);
        rowsToKeep.push(values[i]);
      }
    }
    
    // Clear the sheet and write back unique rows
    sheet.clear();
    sheet.getRange(1, 1, rowsToKeep.length, rowsToKeep[0].length).setValues(rowsToKeep);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: `Removed ${values.length - rowsToKeep.length} duplicate entries`
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in removeDuplicates:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error removing duplicates: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    const barcode = String(data.barcode).trim(); // Ensure barcode is a string and trim whitespace
    const mode = data.mode || 'in'; // Default to 'in' if not specified
    const distributor = data.distributor || ''; // Get distributor name if provided
    
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Get the appropriate sheet based on mode
    let sheet;
    if (mode === 'out') {
      // For inventory out, use or create 'IO' sheet
      sheet = ss.getSheetByName('IO') || ss.insertSheet('IO');
      if (sheet.getLastRow() === 0) {
        // Add headers if sheet is empty
        sheet.appendRow(['Timestamp', 'Unique Identifier', 'Distributor']);
      }
    } else {
      // For inventory in, use or create 'II' sheet
      sheet = ss.getSheetByName('II') || ss.insertSheet('II');
      if (sheet.getLastRow() === 0) {
        // Add headers if sheet is empty
        sheet.appendRow(['Timestamp', 'Unique Identifier']);
      }
    }
    
    // Get all data from the sheet
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Skip header row and check for duplicates
    for (let i = 1; i < values.length; i++) {
      const existingBarcode = String(values[i][1]).trim(); // Column B (index 1)
      if (existingBarcode === barcode) {
        console.log('Duplicate found:', barcode);
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          duplicate: true,
          message: 'Barcode already exists in sheet'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // If not duplicate, append the new row with proper timestamp
    const now = new Date();
    const timestamp = Utilities.formatDate(now, 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');
    
    if (mode === 'out') {
      // For inventory out, include distributor
      sheet.appendRow([timestamp, barcode, distributor]);
    } else {
      // For inventory in, just timestamp and barcode
      sheet.appendRow([timestamp, barcode]);
    }
    
    console.log('Successfully added barcode:', barcode);
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Barcode added successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error processing request: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
} 