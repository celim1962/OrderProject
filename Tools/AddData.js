const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = async (Type,payload, credentialsPath = '../credential.json') => {
    const creds = require(credentialsPath);
    const doc = new GoogleSpreadsheet(creds.docID);

    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();

    let sheet = "";

    switch (Type) {
        case 'items':
            sheet = doc.sheetsById[creds.sheetIdItems];
            break;
        case 'orders':
            sheet = doc.sheetsById[creds.sheetIdOders];
            break;
        default:
            sheet = doc.sheetsById[creds.sheetIdItems];
            break;
    }

    await sheet.addRow(payload);
}