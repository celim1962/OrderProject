const ApiUrl = '.';//'http://localhost:3000';

const home = document.getElementById('Home');
home.style.backgroundImage = `url('${ApiUrl}/HomePage.jpg')`;

const content = document.getElementById('content');
const getItemsUrl = `${ApiUrl}/info/items`;

const btnCart = document.getElementById('btnCart');
const btnOrder = document.getElementById('btnOrder');
const cartDetail = document.getElementById('cartDetails');

const operate = (id, name, action) => {
    let cartList = JSON.parse(localStorage.getItem('cartItems'))
    let target = cartList.filter(item => item.name === name)[0]

    if (action === 0) {
        if (target.count === 1) {
            cartList = cartList.filter(item => item.name !== name)
        }
        else if (target.count > 1) {
            target.count -= 1
        }
    } else {
        target.count += 1
    }



    localStorage.setItem('cartItems', JSON.stringify(cartList))
    loadCartItems()
}

const loadCartItems = () => {
    let count = 0;
    let cartObjects = JSON.parse(localStorage.getItem('cartItems'));

    if (cartObjects.length === 0) {
        cartDetail.innerHTML = '<h2>購物車是空的!</h2>';
        btnOrder.hidden = true;
    } else {
        btnOrder.hidden = false;
        cartDetail.innerHTML = '';

        cartObjects.map(item => {
            cartDetail.innerHTML += `
            <div class='cartItems'>
                <div>
                    <h4>${item.name} x<h4>
                    <div id="cartItemCount${count}">${item.count}</div>
                </div>
                <div>
                    <i class="fa-solid fa-circle-minus" onClick="operate(${count},'${item.name}',0)"></i>
                    <i class="fa-solid fa-circle-plus" onClick="operate(${count},'${item.name}',1)"></i>
                </div>
            </div> `;

            count++;
        })
    }
}

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
                count: 1
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
