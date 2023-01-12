const ApiUrl = '.';//'http://localhost:3000';

const home = document.getElementById('Home');
home.style.backgroundImage = `url('https://lh6.googleusercontent.com/wwnnrBnVHElqtUktAFFQRzdBFLhEIZI_TLrI845qdAVhIGpYi-eaYkh_WsA1vz23PxAQ61ENtauTdk8IjAPAmB5bCBbM9ZkpcwAcy7CLolgvMUhGwv1A6d2YFVMLQEk1ng=w740')`;
home.style.height = '40vh';
home.style.backgroundPosition = 'center';
home.style.backgroundSize = 'cover';



const content = document.getElementById('content');
const getItemsUrl = `${ApiUrl}/info/items`;

const btnCart = document.getElementById('btnCart');
const btnOrder = document.getElementById('btnOrder');
const cartDetail = document.getElementById('cartDetails');
const footer = document.getElementsByClassName('modal-footer')
const cartNotify = document.getElementById('cartNotify')

const operate = (id, name, action) => { // 購物車內增加或是減少指定購物品項的數量事件
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



    localStorage.setItem('cartItems', JSON.stringify(cartList));
    loadCartItems();
    updateShoppingItemNotify();
}

const loadCartItems = () => { // 從LocalStorage取得購物車清單
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
                    <h4>${item.name}<h4>
                    <div id="cartItemCount${count}">x${item.count}</div>
                </div>
                <div>
                    <i class="fa-solid fa-circle-minus" style="margin-right:2px;" onClick="operate(${count},'${item.name}',0)"></i>
                    <i class="fa-solid fa-circle-plus" style="margin-left:2px;" onClick="operate(${count},'${item.name}',1)"></i>
                </div>
            </div> `;
            totalPrice += parseInt(item.price) * parseInt(item.count)
            count++;
        })

        cartDetail.innerHTML += `<br/>
        <div class='cartItems'>
            <div></div>
            <h4>小計:$${totalPrice}(運費另計)</h4>
        </div>


        `;

    }
}

const getData = async url => { // 從後端拿資料
    let res = await fetch(url);
    let data = await res.json()
    return data
}

const updateShoppingItemNotify = () => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems'))
    let productItems = Array.from(document.getElementsByClassName('item'));
    productItems.map(item => {
        let productName = item.children[1].children[0].children[0].innerText;
        let cartItemCount = cartItems.filter(cartItem => cartItem.name === productName)[0]?.count;
        if (cartItemCount) {
            item.children[2].innerText = cartItemCount;
            item.children[2].hidden = false;
        }else{
            item.children[2].hidden = true;
        }

    })
}

const generateItmes = infos => { // 在主頁渲染出購物品項
    infos.map(info => {
        let tempNotify = document.createElement('p');
        tempNotify.innerText = 0;
        tempNotify.style.position = 'absolute';
        tempNotify.style.top = '49%';
        tempNotify.style.right = '0px';
        tempNotify.style.width = '1.5rem';
        tempNotify.style.height = '1.5rem';
        tempNotify.style.textAlign = 'center';
        tempNotify.style.borderRadius = '50%';
        tempNotify.style.backgroundColor = 'red';
        tempNotify.hidden = true;


        let tempDiv = document.createElement('div');
        tempDiv.className = 'item';
        tempDiv.style.position = 'relative';

        let tempImg = document.createElement('img');
        tempImg.src = `${ApiUrl}/${info.pic_route}`

        let tempDivInfo = document.createElement('div');

        let tempDivDescription = document.createElement('div');
        tempDivDescription.className = 'item_description';

        let tempPName = document.createElement('p');
        tempPName.innerText = info.item;

        let tempPPrice = document.createElement('p');
        tempPPrice.innerText = `$${info.price}`;

        let tempDivDetail = document.createElement('div');
        tempDivDetail.className = 'item_detail';

        let tempPDetail = document.createElement('p');
        tempPDetail.innerText = `${info.item_detail}`;

        let tempDivOperate = document.createElement('div');
        tempDivOperate.className = 'item_operate';

        let tempInput = document.createElement('input');
        tempInput.value = '加入購物車';
        tempInput.style.color = 'black';
        tempInput.type = 'button';
        tempInput.dataset.name = info.item;
        tempInput.dataset.price = info.price;

        tempInput.addEventListener('click', e => { // 綁定 加入購物車 按鈕的 點擊事件
            let currentItems = localStorage.getItem('cartItems');
            let target = {
                name: e.target.dataset.name,
                price: e.target.dataset.price,
                count: 1
            };

            cartNotify.hidden = false;

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

            updateShoppingItemNotify()
        })


        tempDivDescription.appendChild(tempPName);
        tempDivDescription.appendChild(tempPPrice);
        tempDivInfo.appendChild(tempDivDescription);

        tempDivDetail.appendChild(tempPDetail);
        tempDivInfo.appendChild(tempDivDetail);

        tempDivOperate.appendChild(tempInput);

        tempDivInfo.appendChild(tempDivOperate);

        tempDiv.appendChild(tempImg);
        tempDiv.appendChild(tempDivInfo);
        tempDiv.appendChild(tempNotify);

        content.appendChild(tempDiv);
    })

}

btnOrder.addEventListener('click', async () => { // 新增右上角購物車icon的點擊事件

    let btnClosed = document.getElementById('btnClosed');

    let receiverName = document.getElementById('receiverName').value;
    let receiverEmail = document.getElementById('receiverEmail').value;
    let receiverPhone = document.getElementById('receiverPhone').value;
    let receiverAddress = document.getElementById('receiverAddress').value;
    let notes = document.getElementById('notes').value;

    let receiverNameErrorMsg = document.getElementById('nameErrorMsg');
    let receiverEmailErrorMsg = document.getElementById('emailErrorMsg');
    let receiverPhoneErrorMsg = document.getElementById('phoneErrorMsg');
    let receiverAddressErrorMsg = document.getElementById('addressErrorMsg');
    let allErrorMsg = document.getElementById('allErrorMsg')


    if (!receiverName) {
        receiverNameErrorMsg.innerText = '未填寫名稱';
        allErrorMsg.hidden = false;
    }
    else if (!receiverEmail || /[^0-9a-zA-Z.]+/.test(receiverEmail)) {
        receiverNameErrorMsg.innerText = '';
        receiverEmailErrorMsg.innerText = '未填寫Email或是Email格式錯誤(請填寫email "@" 符號前面的id)';
        allErrorMsg.hidden = false;
    } else if (!receiverPhoneErrorMsg || !/^\d{9,10}$/.test(receiverPhone)) {
        receiverEmailErrorMsg.innerText = '';
        receiverPhoneErrorMsg.innerText = '未填寫電話或是電話位數錯誤(家用電話9位;手機10位)';
        allErrorMsg.hidden = false;
    } else if (!receiverAddress) {
        receiverPhoneErrorMsg.innerText = '';
        receiverAddressErrorMsg.innerText = '未填寫地址';
        allErrorMsg.hidden = false;
    } else {
        receiverAddressErrorMsg.innerText = '';
        allErrorMsg.hidden = true;

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let payload = {
            data: JSON.parse(localStorage.getItem('cartItems')),
            keyinfo: {
                name: receiverName,
                email: `${receiverEmail}@gmail.com`,
                phone: receiverPhone,
                address: receiverAddress,
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
            cartNotify.hidden = true;
            btnClosed.click()
            window.location.reload()

        }


    }

})

cartNotify.hidden = true;

getData(getItemsUrl)
    .then(res => generateItmes(res))
    .then(() => { // RWD
        if (screen.width < 800) {
            let title = document.getElementsByClassName('title')[0];
            title.children[0].children[0].style.fontSize = '20px';
            title.children[0].children[1].style.fontSize = '1rem';
            title.children[0].style.flexDirection = 'column';

            let item = document.getElementsByClassName('item');
            Array.from(item).map(el => el.style.width = '100%')

        } else {
            let title = document.getElementsByClassName('title')[0];
            title.children[0].children[0].style.fontSize = '2.5rem';

            let item = document.getElementsByClassName('item');
            Array.from(item).map(el => el.style.width = '31%');

        }
    }).then(()=>updateShoppingItemNotify())



