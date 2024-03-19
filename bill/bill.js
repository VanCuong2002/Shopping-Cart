import { dataLocal } from "../assets/js/dataLocalStorage.js";
import { deleteProBill, showErrorToast } from "../toast/toast.js";

// 1. Tổng số lượng của 1 đơn hàng
const totalQuantity = (itemBill) => {
    let totalQty = 0;
    if (itemBill && itemBill.product) {
        itemBill.product.map((pro) => {
            totalQty += pro.quantity;
        });
    }
    return totalQty;
};

// 2. Tính tổng tiền của 1 đơn hàng
const totalPrice = (itemBill) => {
    let total = 0;
    if (itemBill && itemBill.product) {
        itemBill.product.map((pro) => {
            const itemPro = dataPro.find((item) => item.id === pro.id);
            if (itemPro) {
                total += pro.quantity * itemPro.price;
            }
        });
    }
    return total;
};

// Khái báo biến
const dataCart = dataLocal.getDataLocal("cart");
const dataPro = dataLocal.getDataLocal("product");
let dataBill = dataLocal.getDataBillLocal();
const wrapper = document.querySelector(".main__bill");
const billElement = document.querySelector(".bill__product-list");

// Show các đơn hàng lên UI
async function showBill() {
    try {
        if (dataBill === null || dataBill.length === 0) {
            wrapper.innerHTML = `
            <img
                class="bill-empty"
                src="../assets/image/bill-empty.png"
                alt="cart-empty"
            />
        `;
        } else {
            billElement.innerHTML = "";
            dataBill.map((item) => {
                const totalValue = totalPrice(item);
                const billItem = document.createElement("div");

                billItem.classList.add("bill__product-item");
                billItem.innerHTML = `
                    <div class="text-center item-detail">
                        <div class="item-id">${item.id}</div>
                        <span class="detail-text">Details▼</span>
                    </div>
                    <div class="text-center">${item.name}</div>
                    <div class="text-center">${item.purchaseDate}</div>
                    <div class="text-center">${item.product?.length}</div>
                    <div class="text-center">${totalQuantity(item)}</div>
                    <div class="text-center">$ ${totalValue.toLocaleString()}</div>
                    <div class="text-center elementDelete">
                        <i class="fa-solid fa-circle-xmark icon-delete"></i>
                    </div>
                    <div class="modal-detail"></div>
                `;
                billElement.appendChild(billItem);

                // Thêm sự kiện click vào icon delete
                const deleteItem = billItem.querySelector(".elementDelete");
                deleteItem.addEventListener("click", () => {
                    deleteBill(item.id);
                });

                const arrowDetails = document.querySelectorAll(".detail-text");
                arrowDetails.forEach((arrowDetail, index) => {
                    arrowDetail.addEventListener("click", () => {
                        const billItem = document.querySelectorAll(
                            ".bill__product-item"
                        )[index];
                        handleClickDetail(dataBill[index], billItem);
                    });
                });
            });
        }
    } catch (error) {
        console.error("Lỗi", error);
    }
}
showBill();

// 3. Cập nhập số lượng khi trả hàng
const updateByReturn = (bill) => {
    const proUpdate = dataPro.map((item) => {
        const proBill = bill.product.find((pro) => pro.id === item.id);
        if (proBill) {
            return {
                ...item,
                quantity: item.quantity + proBill.quantity,
            };
        }
        return item;
    });
    dataLocal.saveDataLocal(proUpdate, "product");
};

// 4. Xóa đơn hàng
function deleteBill(id) {
    try {
        const confirmDelete = confirm(
            `Bạn có chắc chắn muốn xóa đơn hàng ${id} này không?`
        );
        if (confirmDelete) {
            const itemBill = dataBill.find((item) => item.id === id);
            updateByReturn(itemBill);
            dataBill = dataBill.filter((item) => item.id !== id);
            deleteProBill();
            showBill();
            dataLocal.saveDataBillLocal(dataBill);
        }
    } catch (error) {
        showErrorToast();
    }
}

// 5. Hiển thi detail bill
async function handleClickDetail(item, billItem, back) {
    const modalDetail = billItem.querySelector(".modal-detail");
    const proBill = dataBill?.find((value) => value.id === item.id);
    modalDetail.innerHTML = `
        <div class="modal-content">
            <h3 class="modal-title">Thông tin người mua</h3>
            <div class="buyer-info">
                <p><strong>Tên:</strong> ${proBill.name}</p>
                <p><strong>Email:</strong> ${proBill.email}</p>
                <p><strong>Số điện thoại:</strong> ${proBill.phone}</p>
                <p><strong>Địa chỉ:</strong> ${proBill.address}</p>
                <p><strong>Số nhà:</strong> ${proBill.codeHouse}</p>
                <p><strong>Lời nhắn:</strong> <span id="buyerMessage">${
                    proBill.message ? proBill.message : "Không có lời nhắn nào"
                }</span></p>
            </div>
            <h3 class="modal-title">Thông tin đơn hàng</h3>
            <div class="order-info">
                <div class="order-detail">
                    ${listProductHTML(proBill.product)}
                </div>
            </div>
            <!-- Button đóng modal -->
            <span class="close">&times;</span>
        </div>
    `;
    modalDetail.querySelector(".close").onclick = () => {
        modalDetail.querySelector(".modal-content").style.display = "none";
    };
}

function listProductHTML(product) {
    return product
        .map((product) => {
            const listData = dataLocal.getDataLocal("product");
            const productBill = listData?.find(
                (item) => item.id === product.id
            );
            if (productBill) {
                return `
                <div class="order-item">
                    <img class="img_colums" src="${productBill.photo}" alt="product-img"/>
                    <div class="desPro">
                        <span class="namePro">${productBill.name}</span>
                        <span class="quantityPro">Quantity: ${product.quantity}</span>
                    </div>
                </div>
                `;
            }
        })
        .join("");
}

// 6. Hiển thị số lượng sản phẩm trong giỏ hàng
(function numberCart() {
    const cartItemNumber = document.querySelector(".nav__cart-number");
    if (cartItemNumber) {
        if (dataCart && dataCart.length !== undefined) {
            cartItemNumber.innerText = parseInt(dataCart.length) || 0;
        } else {
            cartItemNumber.innerText = 0;
        }
    }
})();
