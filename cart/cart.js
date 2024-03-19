import { dataLocal } from "../assets/js/dataLocalStorage.js";
import { showWarningToast, deleteProCart } from "../toast/toast.js";

const dataCart = dataLocal.getDataLocal("cart") || [];
const dataPro = dataLocal.getDataLocal("product");
const wrapper = document.querySelector(".main__cart");
const cartList = document.querySelector(".cart__product-list");

const getById = (id) => dataPro.find((item) => item.id === id);

const totalProCart = (product, quantity) => product.price * quantity;

const totalBill = (dataCart) =>
    dataCart.reduce((accumulator, item) => {
        const product = getById(item.id);
        const subTotal = product.price * item.quantity;
        return accumulator + subTotal;
    }, 0);

const showCart = () => {
    if (!dataCart.length) {
        wrapper.innerHTML = `
        <img
            class="img__empty"
            src="../assets/image/empty-cart.png"
            alt="cart-empty"
        />
    `;
    } else {
        let total = totalBill(dataCart);
        cartList.innerHTML = "";
        dataCart.forEach((item) => {
            const product = getById(item.id);
            const subTotal = totalProCart(product, item.quantity);

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart__product-item");
            cartItem.innerHTML = `
          <div class="product__info">
              <img class="product__img" src="${product.photo}" alt="${
                product.name
            }" />
              <div class="product__detail">
                  <span class="product__detail-name">${product.name}</span>
                  <span class="product__detail-quantity">Quantity: ${
                      product.quantity
                  }</span>
              </div>
          </div>
          <div class="product__action">
              <div class="product__change">
                  <button class="btn__decrease">
                      <i class="fa-solid fa-minus"></i>
                  </button>
                  <input type="text" name="product__quantity" class="product__quantity" value="${
                      item.quantity
                  }" />
                  <button class="btn__increase">
                      <i class="fa-solid fa-plus"></i>
                  </button>
              </div>
              <div class="product__price">$ ${product.price.toLocaleString()}</div>
              <div class="product__subtotal">$ ${subTotal.toLocaleString()}</div>
              <button class="product__delete">
                  <i class="fa-regular fa-circle-xmark icon-clean"></i>
              </button>                
          </div>
      `;
            cartList.appendChild(cartItem);

            const clearCartButton = cartItem.querySelector(".icon-clean");
            clearCartButton.onclick = () =>
                removeProduct(item.id, product.name);

            const btnIncrease = cartItem.querySelector(".btn__increase");
            btnIncrease.onclick = () => handlePlus(item.id);

            const btnDecrease = cartItem.querySelector(".btn__decrease");
            btnDecrease.onclick = () => handleMinus(item.id, product.name);
        });

        document.querySelector(".total-bill").innerHTML =
            "<strong>Total: </strong>" + total.toLocaleString() + " $";
    }
};

showCart();

const removeProduct = (id, name) => {
    let confirmDelete = confirm(`Bạn có muốn xóa ${name} khỏi giỏ hàng không?`);
    if (confirmDelete) {
        const productIndex = dataCart.findIndex((item) => item.id === id);
        if (productIndex !== -1) {
            deleteProCart();
            dataCart.splice(productIndex, 1);
            dataLocal.saveDataLocal(dataCart, "cart");
            showCart();
            numberCart();
        }
    }
};

const numberCart = () => {
    const cartItemNumber = document.querySelector(".nav__cart-number");
    if (cartItemNumber) {
        cartItemNumber.innerText = dataCart.length.toString();
    }
};
numberCart();

const handlePlus = (id) => {
    const productIndex = dataCart.findIndex((item) => item.id === id);
    if (productIndex !== -1) {
        const product = getById(id);
        if (dataCart[productIndex].quantity < product.quantity) {
            dataCart[productIndex].quantity++;
            dataLocal.saveDataLocal(dataCart, "cart");
            showCart();
        } else {
            showWarningToast();
        }
    }
};

const handleMinus = (id, name) => {
    const productIndex = dataCart.findIndex((item) => item.id === id);
    if (productIndex !== -1) {
        if (dataCart[productIndex].quantity > 1) {
            dataCart[productIndex].quantity--;
            dataLocal.saveDataLocal(dataCart, "cart");
            showCart();
        } else {
            let confirmItem = confirm(
                `Bạn có muốn xóa ${name} khỏi giỏ hàng không?`
            );
            if (confirmItem) {
                dataCart.splice(productIndex, 1);
                dataLocal.saveDataLocal(dataCart, "cart");
                showCart();
                numberCart();
            }
        }
    }
};

const buyButton = document.querySelector(".cart__buy-btn");
const dialog = document.querySelector(".dialog");
const dialogOverlay = document.querySelector(".dialog-overlay");
const cancelButton = document.querySelector(".form-cancel");
const cancelAction = document.querySelector(".action-cancel");

if (buyButton) {
    buyButton.addEventListener("click", function () {
        dialog.style.display = "flex";
    });
}

cancelButton.addEventListener("click", function () {
    dialog.style.display = "none";
});

dialogOverlay.addEventListener("click", function () {
    dialog.style.display = "none";
});

cancelAction.addEventListener("click", function () {
    dialog.style.display = "none";
});
