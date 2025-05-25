// Google Apps Script code for handling barcode scanning and inventory tracking

/**
 * Handles GET requests to the web app
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Service is running'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Checks if the required sheets exist and initializes them if needed
 */
function checkAndInitializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ['II', 'IO'];
  
  sheets.forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    initializeSheetHeaders(sheet);
  });
}

/**
 * Initializes sheet headers for both II and IO sheets
 */
function initializeSheetHeaders(sheet) {
  // Set up headers based on sheet name
  if (sheet.getName() === 'IO') {
    const headers = [
      'Timestamp',
      'Batch ID',
      'Manufacturing Date',
      'Scan Timestamp',
      'Product Info',
      'Serial Number',
      'Control Code',
      'Distributor'
    ];
    
    // Set headers
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold');
      
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    return true;
  } else if (sheet.getName() === 'II') {
    const headers = [
      'Timestamp',
      'Batch ID',
      'Manufacturing Date',
      'Scan Timestamp',
      'Product Info',
      'Serial Number',
      'Control Code'
    ];
    
    // Set headers
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold');
      
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    return true;
  }
  return false;
}

/**
 * Handles POST requests to the web app
 * Processes barcode scans and adds data to the appropriate sheet
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    const barcode = String(data.barcode).trim();
    const mode = data.mode || 'in';
    const distributor = data.distributor || '';
    
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Get the appropriate sheet based on mode
    let sheet;
    if (mode === 'out') {
      sheet = ss.getSheetByName('IO') || ss.insertSheet('IO');
      initializeSheetHeaders(sheet);
    } else {
      sheet = ss.getSheetByName('II') || ss.insertSheet('II');
      initializeSheetHeaders(sheet);
    }
    
    // Get all data from the sheet
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Check if the barcode is in DataMatrix format
    const isDataMatrix = isDataMatrixFormat(barcode);
    
    // Parse the barcode data based on format
    let parsedData;
    if (isDataMatrix) {
      parsedData = parseDataMatrix(barcode);
    } else {
      parsedData = {
        batchId: barcode,
        manufacturingDate: '',
        timestamp: '',
        productInfo: '',
        serialNumber: '',
        controlCode: ''
      };
    }
    
    // Check for duplicates using batch ID
    for (let i = 1; i < values.length; i++) {
      const existingBatchId = String(values[i][1]).trim();
      if (existingBatchId === parsedData.batchId) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          duplicate: true,
          message: mode === 'out' ? 'Item has already been processed for inventory out' : `Barcode ${barcode} already exists in inventory.`
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // If not duplicate, append the new row with proper timestamp
    const now = new Date();
    const timestamp = Utilities.formatDate(now, 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');
    
    const rowData = [
      timestamp,
      parsedData.batchId,
      parsedData.manufacturingDate,
      parsedData.timestamp,
      parsedData.productInfo,
      parsedData.serialNumber,
      parsedData.controlCode
    ];

    if (mode === 'out') {
      rowData.push(distributor);
    }
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data added successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error processing request: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Parses DataMatrix barcode data and extracts components
 */
function parseDataMatrix(data) {
  const components = data.split('~');
  return {
    batchId: components[0] || '',
    manufacturingDate: components[1] || '',
    timestamp: components[2] || '',
    productInfo: components[3] || '',
    serialNumber: components[4] || '',
    controlCode: components[5] || ''
  };
}

/**
 * Checks if a string is in DataMatrix format
 */
function isDataMatrixFormat(data) {
  return data.includes('~');
} 
