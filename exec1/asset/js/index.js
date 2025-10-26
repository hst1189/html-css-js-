fetch('/asset/data/itemList.json')
    .then(response => response.json()) // 将响应转换为 JSON
    .then(data => {
        console.log(data); // 处理解析后的 JSON 数据
        //const itemList = JSON.parse(data);
        const itemListContainer = document.querySelector('.item-list');
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const item = data[key];
                itemListContainer.innerHTML += `
                <div class="item">
                    <div class="item_up">
                        <img class="item_image" src="${item.item_image}" alt="${item.item_name}">
                        <h3 class="item_name">${item.item_name}</h3>
                        <p class="item_description">${item.item_description}</p>
                    </div>
                    <div class="item_down">
                        <p class="item_price">价格：${item.item_price}</p>
                        <div><button onclick="addToCart('${key}','${item.item_name}',${item.item_price})"><i class="fa-solid fa-cart-plus"></i> 加入购物车</button></div>
                    </div>
                </div>
                
                `;
            }
        }
    })
    .catch(error => {
        console.error('读取或解析 JSON 时发生错误:', error);
    });




function getCart() {
    return JSON.parse(localStorage.getItem('cart'));
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function clearCart() {
    localStorage.removeItem('cart');
}

function addToCart(id, name, price) {
    let cart = getCart();
    // cart存在判断、存在しない場合
    if (!cart) {
        cart = {
            totalNum: 1,
            totalPrice: price,
            [id]: {
                item_name: name,
                item_num: 1,
                item_price: price
            }
        }
        // cart存在する場合    
    } else {
        cart.totalNum += 1;
        cart.totalPrice += price;

        // キー存在判定
        let flg = false;
        for (const key in cart) {
            if (id === key) {
                flg = true;
                break;
            }
        }

        if (flg) {
            cart[id].item_name = name;
            cart[id].item_num += 1;
            cart[id].item_price += price;
        } else {
            const item = {
                item_name: name,
                item_num: 1,
                item_price: price
            }
            cart[id] = item;
        }
    }
    saveCart(cart);
    showCart();
}

function delCart(id) {
    const cart = getCart();
    const item = cart[id];
    cart.totalNum = cart.totalNum - item.item_num;
    cart.totalPrice = cart.totalPrice - item.item_price;
    delete cart[id];
    saveCart(cart);
    showCart();
}


function showCart() {
    const cart = getCart();
    if (!cart) {
        document.querySelector('.count').innerHTML = ``;
        document.querySelector('.cart-items').innerHTML = ``;
    } else {
        document.querySelector('.count').innerHTML = `
            <p>总数：${cart.totalNum}</p>
            <p>总价格：${cart.totalPrice}</p>
            <div class="clear"><button onclick='initCart()'><i class="fa-solid fa-cart-shopping"></i> 清空购物车</button></div>
        `;
        document.querySelector('.cart-items').innerHTML = ``;
        let cart_str = JSON.stringify(cart);
        for (const key in cart) {
            if (cart.hasOwnProperty(key) && key != "totalNum" && key != "totalPrice") {
                document.querySelector('.cart-items').innerHTML += `
                <div class="cart-item">
                    <h5 class="item_name">商品：${cart[key].item_name}</h5>
                    <p class="item_num">数量：${cart[key].item_num}</p>
                    <p class="item_price">价格：${cart[key].item_price}</p>
                    <button onclick="delCart('${key}')"><i class="fa-solid fa-cart-arrow-down"></i> 删除</button>
                </div>
                `;
            }
        }
    }
}

function initCart() {
    clearCart();
    showCart();
}

showCart();