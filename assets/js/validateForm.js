import { dataLocal } from "./dataLocalStorage.js";
import { buySuccess, showErrorToast } from "../../toast/toast.js";

// Khai báo các biến DOM
const firstName = document.getElementById("first-name");
const lastName = document.querySelector(".last-name");
const email = document.getElementById("email");
const phone = document.querySelector(".phone-number");
const code = document.getElementById("home-number");
const city = document.getElementById("province");
const district = document.getElementById("district");
const ward = document.getElementById("ward");
const errorUser = document.getElementById("error-user");
const errorEmail = document.getElementById("error-email");
const errorPhone = document.getElementById("error-phone");
const errorAddress = document.getElementById("error-address");

// Lấy dữ liệu từ localStorage
const apiBill = dataLocal.getDataBillLocal() || [];
const dataCart = dataLocal.getDataLocal("cart");

// Các hàm validate
firstName?.addEventListener("blur", () => validateFullName());
lastName?.addEventListener("blur", () => validateFullName());
email?.addEventListener("blur", validateEmail);
phone?.addEventListener("blur", validatePhone);
code?.addEventListener("blur", validateCodeHouse);
city?.addEventListener("blur", validateAddress);
district?.addEventListener("blur", validateAddress);
ward?.addEventListener("blur", validateAddress);

// Hàm validate họ và tên
function validateFullName() {
    const regexName = /^[^\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    const isValidFirstName =
        firstName.value.trim() !== "" && regexName.test(firstName.value.trim());
    const isValidLastName =
        lastName.value.trim() !== "" && regexName.test(lastName.value.trim());

    if (!isValidFirstName || !isValidLastName) {
        firstName.style.border = isValidFirstName
            ? "1px solid #ccc"
            : "1px solid red";
        lastName.style.border = isValidLastName
            ? "1px solid #ccc"
            : "1px solid red";
        errorUser.innerHTML = "Tên không hợp lệ!";
        return false;
    } else {
        errorUser.innerHTML = "";
        firstName.style.border = "1px solid #ccc";
        lastName.style.border = "1px solid #ccc";
        return true;
    }
}

// Hàm validate email
function validateEmail() {
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email.value) {
        email.style.border = "1px solid red";
        errorEmail.innerHTML = "Email không được để trống!";
        return false;
    } else if (!regexEmail.test(email.value)) {
        email.style.border = "1px solid red";
        errorEmail.innerHTML = "Email sai định dạng!";
        return false;
    } else {
        errorEmail.innerHTML = "";
        email.style.border = "1px solid #ccc";
        return true;
    }
}

// Hàm validate số điện thoại
function validatePhone() {
    const regexPhone = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    if (!phone.value) {
        phone.style.border = "1px solid red";
        errorPhone.innerHTML = "Số điện thoại không được để trống!";
        return false;
    } else if (!regexPhone.test(phone.value)) {
        phone.style.border = "1px solid red";
        errorPhone.innerHTML = "Số điện thoại không hợp lệ!";
        return false;
    } else {
        errorPhone.innerHTML = "";
        phone.style.border = "1px solid #ccc";
        return true;
    }
}

// Hàm validate địa chỉ
function validateAddress() {
    function validateCity() {
        if (city.value === "") {
            city.style.border = "1px solid red";
            return false;
        } else {
            city.style.border = "1px solid #ccc";
            return true;
        }
    }

    function validateDistrict() {
        if (district.value === "") {
            district.style.border = "1px solid red";
            return false;
        } else {
            district.style.border = "1px solid #ccc";
            return true;
        }
    }

    function validateWard() {
        if (ward.value === "") {
            ward.style.border = "1px solid red";
            return false;
        } else {
            ward.style.border = "1px solid #ccc";
            return true;
        }
    }

    const isValidCity = validateCity();
    const isValidDistrict = validateDistrict();
    const isValidWard = validateWard();

    if (!isValidCity || !isValidDistrict || !isValidWard) {
        errorAddress.innerHTML = "Vui lòng chọn đầy đủ thông tin địa chỉ!";
        return false;
    } else {
        errorAddress.innerHTML = "";
        return true;
    }
}

// Hàm validate mã nhà
function validateCodeHouse() {
    const regexCodeHouse = /^[1-9][0-9]*$/;
    if (!code.value.trim()) {
        code.style.border = "1px solid red";
        errorAddress.innerHTML = "Vui lòng nhập địa chỉ đầy đủ!";
        return false;
    } else if (!regexCodeHouse.test(code.value)) {
        errorAddress.innerHTML = "Mã nhà phải nhập bằng số!";
        code.style.border = "1px solid red";
        return false;
    } else {
        errorAddress.innerHTML = "";
        code.style.border = "1px solid #ccc";
        return true;
    }
}

// Hàm validate và xử lý khi nhấn nút xác nhận
function validate() {
    const isValidFullName = validateFullName();
    const isValidEmail = validateEmail();
    const isValidPhone = validatePhone();
    const isValidAddress = validateAddress();
    const isValidCodeHouse = validateCodeHouse();

    if (
        isValidFullName &&
        isValidEmail &&
        isValidPhone &&
        isValidAddress &&
        isValidCodeHouse
    ) {
        const order = {
            id: generateRandomId(10),
            name: firstName.value + " " + lastName.value,
            email: email.value,
            phone: phone.value,
            address: ` ${ward.options[ward.selectedIndex].text}, ${
                district.options[district.selectedIndex].text
            }, ${city.options[city.selectedIndex].text}`,
            codeHouse: code.value,
            purchaseDate: currentTime(),
            product: dataCart,
            message: message.value,
        };
        apiBill.push(order);
        dataLocal.saveDataBillLocal(apiBill);
        buySuccess();
        updateQuantityAfterBuy();
        dataLocal.saveDataLocal([], "cart");
    } else {
        showErrorToast();
    }
}

// Gọi hàm validate khi nhấn nút Xác nhận
document.querySelector(".action-confirm")?.addEventListener("click", validate);

// Hàm sinh mã ngẫu nhiên
function generateRandomId(length) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomId = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
    }
    return randomId;
}

// Hàm lấy thời gian hiện tại
function currentTime() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = "0" + dd;
    }
    if (mm < 10) {
        mm = "0" + mm;
    }
    let current = dd + "/" + mm + "/" + yyyy;
    return current;
}

// Hàm cập nhật số lượng sau khi mua
const updateQuantityAfterBuy = () => {
    const listData = dataLocal.getDataLocal("product");
    const dataCart = dataLocal.getDataLocal("cart");
    dataCart.forEach((pro1) => {
        listData.forEach((pro2) => {
            if (pro1.id === pro2.id) {
                pro2.quantity = pro2.quantity - pro1.quantity;
            }
        });
    });
    dataLocal.saveDataLocal(listData, "product");
};

export { apiBill };
