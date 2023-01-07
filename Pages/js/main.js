const ApiUrl = '.';//'http://localhost:3000';

const home = document.getElementById('Home');
home.style.backgroundImage = `url('${ApiUrl}/HomePage.jpg')`;

const content = document.getElementById('content');
const getItemsUrl = `${ApiUrl}/info/items`;

const btnCart = document.getElementById('btnCart');
const btnOrder = document.getElementById('btnOrder');
const cartDetail = document.getElementById('cartDetails');
const footer = document.getElementsByClassName('modal-footer')
const cartNotify = document.getElementById('cartNotify')

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
    let totalPrice = 0;
    let cartObjects = JSON.parse(localStorage.getItem('cartItems'));

    if (!cartObjects || cartObjects.length === 0) {
        cartDetail.innerHTML = '<h2>購物車是空的!</h2>';
        Array.from(footer).map(item => item.hidden = true)
        cartNotify.hidden = true;
    } else {
        cartNotify.hidden = false;

        Array.from(footer).map(item => item.hidden = false);
        cartDetail.innerHTML = '';

        cartObjects.map(item => {
            cartDetail.innerHTML += `
            <div class='cartItems'>
                <div>
                    <h4>${item.name} x<h4>
                    <div id="cartItemCount${count}">${item.count}</div>
                </div>
                <div>
                    <i class="fa-solid fa-circle-minus" style="margin-right:5px;" onClick="operate(${count},'${item.name}',0)"></i>
                    <i class="fa-solid fa-circle-plus" style="margin-left:5px;" onClick="operate(${count},'${item.name}',1)"></i>
                </div>
            </div> `;
            totalPrice += parseInt(item.price) * parseInt(item.count)
            count++;
        })

        cartDetail.innerHTML += `<br/>
        <div class='cartItems'>
            <div></div>
            <h4>小計:$${totalPrice}</h4>
        </div>


        `;

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
            cartNotify.hidden = false;

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

btnOrder.addEventListener('click', async () => {

    let btnClosed = document.getElementById('btnClosed');

    let receiverName = document.getElementById('receiverName').value;
    let receiverEmail = document.getElementById('receiverEmail').value;
    let receiverPhone = document.getElementById('receiverPhone').value;
    let notes = document.getElementById('notes').value;

    let receiverNameErrorMsg = document.getElementById('nameErrorMsg');
    let receiverEmailErrorMsg = document.getElementById('emailErrorMsg');
    let receiverPhoneErrorMsg = document.getElementById('phoneErrorMsg');


    if (!receiverName) {
        receiverNameErrorMsg.innerText = '未填寫名稱';
    }
    else if (!receiverEmail || /[^0-9a-zA-Z.]+/.test(receiverEmail)) {
        receiverNameErrorMsg.innerText = '';
        receiverEmailErrorMsg.innerText = '未填寫Email或是Email格式錯誤(請填寫email "@" 符號前面的id)';
    } else if (!receiverPhoneErrorMsg || !/^\d{9,10}$/.test(receiverPhone)) {
        receiverEmailErrorMsg.innerText = '';
        receiverPhoneErrorMsg.innerText = '未填寫電話或是電話位數錯誤(家用電話9位;手機10位)';
    } else {
        receiverPhoneErrorMsg.innerText = '';

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let payload = {
            data: JSON.parse(localStorage.getItem('cartItems')),
            keyinfo: {
                name: receiverName,
                email: `${receiverEmail}@gmail.com`,
                phone: receiverPhone,
                notes: notes
            }
        }

        let res = await fetch('./notify', {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(payload)
        });

        res = await res.json();
        console.log(res)
        if (!res) {

            alert('Email寄送失敗 請嘗試輸入其他Email')
        } else {
            localStorage.setItem('cartItems', JSON.stringify([]));

            btnClosed.click()
        }


    }

})


getData(getItemsUrl).then(res => generateItmes(res))
