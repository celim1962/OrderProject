const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = async (Type, Item, credentialsPath = '../credential.json') => {
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
    const rows = await sheet.getRows();
    let count = 0
    for (row of rows) {
        if (row._rawData[0] === Item) {
            await rows[count].delete()
        } else {
            count++
        }


    }

}