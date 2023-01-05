const ApiUrl = '.';//'http://localhost:3000';

const home = document.getElementById('Home');
home.style.backgroundImage = `url('${ApiUrl}/HomePage.jpg')`;

const content = document.getElementById('content');
const getItemsUrl = `${ApiUrl}/info/items`;

const btnCart = document.getElementById('btnCart');
const cartDetail = document.getElementById('cartDetails');

btnCart.addEventListener('click', () => {
    let cartObjects = JSON.parse(localStorage.getItem('cartItems'));
    cartObjects.map(item => {
        cartDetail.innerHTML += `
        <h4>${item.name}*${item.count}</h4> `
    })
    console.log(cartObjects)
})

const getData = async url => {
    let res = await fetch(url);
    let data = await res.json()
    return data
}

const generateItmes = infos => {
    infos.map(info => {
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
        tempInput.value = '加入購物車';
        tempInput.style.color = 'black';
        tempInput.type = 'button';
        tempInput.dataset.name = info.item;
        tempInput.dataset.price = info.price;

        tempInput.addEventListener('click', e => {
            let currentItems = localStorage.getItem('cartItems');
            let target = {
                name: e.target.dataset.name,
                price: e.target.dataset.price,
                count: 0
            };

            if (!currentItems) {
                localStorage.setItem('cartItems', JSON.stringify([target]))
            } else {
                currentItems = JSON.parse(currentItems);

                if (currentItems.filter(item => item.name === target.name).length === 0) {
                    currentItems.push(target);
                    localStorage.setItem('cartItems', JSON.stringify(currentItems));
                } else {
                    let obj = currentItems.filter(item => item.name === target.name)[0]
                    obj.count += 1
                    localStorage.setItem('cartItems', JSON.stringify(currentItems));
                }

            }
        })


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


getData(getItemsUrl).then(res => generateItmes(res))
