// appsScriptService.js
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz_tJRzLM30XtCSLRCPm-LDBY7UrQSB5_-6HlaKAbbG9mnNoACI_dZvmsyuOEUWUHfeXQ/exec';

// Initialize sheet with headers if needed
export const initializeSheet = async () => {
  try {
    console.log('Initializing sheet with URL:', APPS_SCRIPT_URL);
    const response = await fetch(APPS_SCRIPT_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    console.log('Initialization response:', text);
    return true;
  } catch (error) {
    console.error('Error initializing sheet:', error);
    return false;
  }
};

// Function to append data to Google Sheet
export const appendToSheet = async (barcode, mode = 'in', distributor = null) => {
  try {
    console.log('appendToSheet called with:', { barcode, mode, distributor });
    
    // 1. Validate barcode format
    if (!barcode || typeof barcode !== 'string') {
      console.log('Invalid barcode format:', barcode);
      return {
        success: false,
        message: 'Invalid barcode format'
      };
    }

    // 2. Prepare request data
    const requestData = {
      barcode: barcode,
      mode: mode,
      distributor: distributor
    };

    console.log('Sending request to Google Apps Script:', {
      url: APPS_SCRIPT_URL,
      method: 'POST',
      data: requestData
    });

    // 3. Make POST request to Google Apps Script
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('Response status:', response.status);
    
    // 4. Parse response
    const responseText = await response.text();
    console.log('Raw response from server:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed response data:', data);
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      return {
        success: false,
        message: 'Invalid response from server'
      };
    }
    
    // 5. Return appropriate response
    if (data.success) {
      return {
        success: true,
        message: data.message
      };
    } else {
      console.log('Server returned error:', data);
      return {
        success: false,
        notFound: data.notFound || false,
        duplicate: data.duplicate || false,
        message: data.message || 'Failed to save barcode'
      };
    }
  } catch (error) {
    console.error('Error in appendToSheet:', error);
    return {
      success: false,
      message: 'Failed to connect to Google Sheets: ' + error.message
    };
  }
};

export const removeDuplicates = async () => {
  try {
    console.log('Removing duplicates with URL:', APPS_SCRIPT_URL + '?action=removeDuplicates');
    const response = await fetch(APPS_SCRIPT_URL + '?action=removeDuplicates', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Remove duplicates response:', data);
    return {
      success: data.success,
      message: data.message
    };
  } catch (error) {
    console.error('Error removing duplicates:', error);
    return {
      success: false,
      message: 'Failed to connect to Google Sheets'
    };
  }
}; 