const ApiUrl = 'http://localhost:3000';

const content = document.getElementById('content');
const getItemsUrl = `${ApiUrl}/info/items`;

const getData = async url => {
    let res = await fetch(url);
    let data = await res.json()
    return data
}

const getItmes = async (infos) => {


    infos.map(async info => {
        let tempDiv = document.createElement('div');
        tempDiv.className = 'item';

        let tempImg = document.createElement('img');
        tempImg.src = `${ApiUrl}/${info.pic_route}`

        let tempDivInfo = document.createElement('div');

        let tempDivDescription = document.createElement('div');
        tempDivDescription.className = 'item_description';

        let tempPName = document.createElement('p');
        tempPName.innerText = info.item;

        let tempPPrice = document.createElement('p');
        tempPPrice.innerText = `$${info.price}`;

        let tempDivOperate = document.createElement('div');
        tempDivOperate.className = 'item_operate';

        let tempInput = document.createElement('input');
        tempInput.value = 'Add To Cart';
        tempInput.type = 'button'


        tempDivDescription.appendChild(tempPName);
        tempDivDescription.appendChild(tempPPrice);
        tempDivInfo.appendChild(tempDivDescription);

        tempDivOperate.appendChild(tempInput);

        tempDivInfo.appendChild(tempDivOperate);

        tempDiv.appendChild(tempImg);
        tempDiv.appendChild(tempDivInfo);

        content.appendChild(tempDiv);
    })

}

getData(getItemsUrl).then(res => getItmes(res))

