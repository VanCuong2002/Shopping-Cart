import { dataLocal } from "../assets/js/dataLocalStorage.js";
import { listData } from "../assets/js/api.js";
import { addCartSuccess, showWarningToast } from "../toast/toast.js";

const wrapper = document.querySelector(".main");
let dataCart = [];
let dataPro = [];

(function initializeData() {
    dataPro = dataLocal.getDataLocal("product");
    if (!dataPro || dataPro.length === 0) {
        dataLocal.saveDataLocal(listData, "product");
        dataPro = listData;
    }
    dataCart = dataLocal.getDataLocal("cart") || [];
})();

const showProducts = () => {
    if (!dataPro) {
        console.error("Dữ liệu sản phẩm không tồn tại.");
        return;
    }

    dataPro.forEach((product) => {
        if (product.price === undefined) {
            console.error(`Sản phẩm với ID ${product.id} không có giá.`);
            return;
        }

        const mainProduct = document.createElement("div");
        mainProduct.classList.add("main-product");

        const price = product.price;
        mainProduct.innerHTML = `
            <div class="img-product">
                <img src=${product.photo} alt="" />
                <button type="button" class="btn-cart">
                    <i class="fa-solid fa-cart-shopping"></i>
                </button>
            </div>
            <div class="content-product">
                <h3 class="content-product__h3">${product.name}</h3>
                <div class="content-product__details">
                    <span class="content-product__money">$${price.toLocaleString()}</span>
                    <span class="content-product__quantity">Quantity: ${
                        product.quantity
                    }</span>
                </div>
            </div>
        `;

        wrapper.appendChild(mainProduct);

        const addToCartButton = mainProduct.querySelector(".btn-cart");
        addToCartButton.addEventListener("click", () => {
            addToCart(product.id);
        });
    });
};

const addToCart = (idSP) => {
    const productIndex = dataPro.findIndex((item) => item.id === idSP);
    if (productIndex === -1 || dataPro[productIndex].price === undefined) {
        console.error(`Không thể thêm sản phẩm có ID ${idSP} vào giỏ hàng.`);
        return;
    }

    if (dataPro[productIndex].quantity === 0) {
        alert("Sản phẩm này đã hết hàng. Vui lòng chọn sản phẩm khác!");
        return;
    }

    const cartItemIndex = dataCart.findIndex((item) => item.id === idSP);
    if (cartItemIndex === -1) {
        addCartSuccess();
        dataCart.push({ id: idSP, quantity: 1 });
    } else {
        if (
            dataCart[cartItemIndex].quantity >= dataPro[productIndex].quantity
        ) {
            showWarningToast();
            return;
        }
        addCartSuccess();
        dataCart[cartItemIndex].quantity++;
    }

    dataLocal.saveDataLocal(dataCart, "cart");
    numberCart();
};

const numberCart = () => {
    const cartItemNumber = document.querySelector(".nav__cart-number");
    if (cartItemNumber) {
        cartItemNumber.innerText = dataCart.length.toString();
    }
};

const render = () => {
    numberCart();
    showProducts();
};

document.addEventListener("DOMContentLoaded", render);
