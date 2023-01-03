const { GoogleSpreadsheet } = require('google-spreadsheet');


module.exports = async (Type, credentialsPath = '../credential.json') => {
    const result = [];
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

    for (row of rows) {
        let tempObj = {}
        
        for(let i=0;i<row._sheet.headerValues.length;i++){
            tempObj[row._sheet.headerValues[i]] = row._rawData[i]
        }

        result.push(tempObj)
    }

    return result;
}
