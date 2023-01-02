const { GoogleSpreadsheet } = require('google-spreadsheet');


module.exports = async (docID, sheetID, getType='all', credentialsPath = '../credential.json') => {
    const result = [];
    const doc = new GoogleSpreadsheet(docID);
    const creds = require(credentialsPath);

    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();

    const sheet = doc.sheetsById[sheetID];
    const rows = await sheet.getRows();


    for (row of rows) {
        switch (getType) {
            case 'orders':
                result.push(`${row.name}|${row.email}|${row.info}|${row.notes}`);
                break
            case 'items':
                result.push(`${row.item}:${row.price}`);
                break
            default:
                result.push(row._rawData)
                break
        }
        
    }


    return result;
}
