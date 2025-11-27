/**
 * Excel Utilities
 * Fungsi-fungsi untuk export dan import data Excel menggunakan ExcelJS
 */

const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs').promises;

/**
 * Create Excel file from data
 * @param {Array} data - Array of objects to export
 * @param {String} sheetName - Name of the worksheet (default: 'Data')
 * @returns {String} Path to the created Excel file
 */
const createExcelFile = async (data, sheetName = 'Data') => {
    try {
        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);

        if (!data || data.length === 0) {
            throw new Error('No data to export');
        }

        // Get columns from first data item
        const firstItem = data[0];
        const columns = Object.keys(firstItem).map(key => ({
            header: formatHeader(key),
            key: key,
            width: calculateColumnWidth(key, data)
        }));

        worksheet.columns = columns;

        // Style header row
        worksheet.getRow(1).font = { bold: true, size: 12 };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4F46E5' } // Indigo color
        };
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // Add data rows
        data.forEach(item => {
            const row = worksheet.addRow(item);

            // Format specific data types
            row.eachCell((cell, colNumber) => {
                const key = columns[colNumber - 1].key;
                const value = item[key];

                // Format dates
                if (value instanceof Date) {
                    cell.numFmt = 'dd/mm/yyyy';
                }

                // Format numbers
                if (typeof value === 'number') {
                    cell.numFmt = '#,##0.00';
                }

                // Format arrays as comma-separated values
                if (Array.isArray(value)) {
                    cell.value = value.join(', ');
                }

                // Alignment
                cell.alignment = { vertical: 'middle', wrapText: true };
            });
        });

        // Add borders to all cells
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        // Auto-filter
        worksheet.autoFilter = {
            from: 'A1',
            to: `${String.fromCharCode(64 + columns.length)}1`
        };

        // Freeze first row
        worksheet.views = [
            { state: 'frozen', xSplit: 0, ySplit: 1 }
        ];

        // Create temp directory if not exists
        const tempDir = path.join(__dirname, '../../temp');
        try {
            await fs.mkdir(tempDir, { recursive: true });
        } catch (err) {
            // Directory already exists
        }

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `export_${timestamp}.xlsx`;
        const filePath = path.join(tempDir, filename);

        // Write to file
        await workbook.xlsx.writeFile(filePath);

        return filePath;
    } catch (error) {
        console.error('Error creating Excel file:', error);
        throw new Error(`Failed to create Excel file: ${error.message}`);
    }
};

/**
 * Read Excel file and parse to JSON
 * @param {Object} file - Multer file object or file path
 * @returns {Array} Array of parsed data objects
 */
const readExcelFile = async (file) => {
    try {
        const workbook = new ExcelJS.Workbook();

        // Load from file path or buffer
        if (typeof file === 'string') {
            await workbook.xlsx.readFile(file);
        } else if (file.buffer) {
            await workbook.xlsx.load(file.buffer);
        } else if (file.path) {
            await workbook.xlsx.readFile(file.path);
        } else {
            throw new Error('Invalid file input');
        }

        // Get first worksheet
        const worksheet = workbook.worksheets[0];

        if (!worksheet) {
            throw new Error('No worksheet found in Excel file');
        }

        const data = [];
        const headers = [];

        // Parse rows
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                // First row is header
                row.eachCell((cell) => {
                    headers.push(normalizeHeader(cell.value));
                });
            } else {
                // Data rows
                const rowData = {};
                row.eachCell((cell, colNumber) => {
                    const header = headers[colNumber - 1];
                    if (header) {
                        rowData[header] = parseCellValue(cell.value);
                    }
                });

                // Only add row if it has at least one non-empty value
                if (Object.values(rowData).some(val => val !== null && val !== undefined && val !== '')) {
                    data.push(rowData);
                }
            }
        });

        return data;
    } catch (error) {
        console.error('Error reading Excel file:', error);
        throw new Error(`Failed to read Excel file: ${error.message}`);
    }
};

/**
 * Format header text for display
 * @param {String} key - Object key
 * @returns {String} Formatted header
 */
const formatHeader = (key) => {
    // Remove underscores and capitalize
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Normalize header from Excel to valid object key
 * @param {String} header - Header text from Excel
 * @returns {String} Normalized key
 */
const normalizeHeader = (header) => {
    if (!header) return '';

    return String(header)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
};

/**
 * Parse cell value to appropriate JavaScript type
 * @param {*} value - Cell value
 * @returns {*} Parsed value
 */
const parseCellValue = (value) => {
    if (value === null || value === undefined) {
        return null;
    }

    // Handle Excel date format
    if (value instanceof Date) {
        return value;
    }

    // Handle rich text
    if (value.richText) {
        return value.richText.map(rt => rt.text).join('');
    }

    // Handle hyperlink
    if (value.hyperlink) {
        return value.text || value.hyperlink;
    }

    // Handle formula result
    if (value.result !== undefined) {
        return value.result;
    }

    // Parse comma-separated values to array
    if (typeof value === 'string' && value.includes(',')) {
        const parts = value.split(',').map(s => s.trim()).filter(s => s);
        // If all parts are numbers, return array of numbers
        if (parts.every(p => !isNaN(p))) {
            return parts.map(p => Number(p));
        }
        return parts;
    }

    return value;
};

/**
 * Calculate optimal column width based on content
 * @param {String} key - Column key
 * @param {Array} data - Data array
 * @returns {Number} Column width
 */
const calculateColumnWidth = (key, data) => {
    const headerLength = formatHeader(key).length;

    // Sample first 100 rows to determine width
    const sampleData = data.slice(0, 100);
    const maxContentLength = sampleData.reduce((max, item) => {
        const value = item[key];
        if (value === null || value === undefined) return max;

        const length = Array.isArray(value)
            ? value.join(', ').length
            : String(value).length;

        return Math.max(max, length);
    }, 0);

    // Return width (max of header and content, with min/max limits)
    const width = Math.max(headerLength, maxContentLength) + 2;
    return Math.min(Math.max(width, 10), 50); // Min 10, max 50
};

/**
 * Delete temporary file
 * @param {String} filePath - Path to file to delete
 */
const deleteTempFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.error('Error deleting temp file:', error);
        // Don't throw error, just log it
    }
};

/**
 * Clean up old temp files (older than 1 hour)
 */
const cleanupTempFiles = async () => {
    try {
        const tempDir = path.join(__dirname, '../../temp');
        const files = await fs.readdir(tempDir);
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        for (const file of files) {
            const filePath = path.join(tempDir, file);
            const stats = await fs.stat(filePath);

            if (now - stats.mtime.getTime() > oneHour) {
                await fs.unlink(filePath);
                console.log(`Cleaned up old temp file: ${file}`);
            }
        }
    } catch (error) {
        console.error('Error cleaning up temp files:', error);
    }
};

module.exports = {
    createExcelFile,
    readExcelFile,
    deleteTempFile,
    cleanupTempFiles
};
