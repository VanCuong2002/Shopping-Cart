// Toast function
function toast({ title = "", message = "", type = "info", duration }) {
    const main = document.getElementById("toast");
    if (main) {
        const toast = document.createElement("div");

        // Auto remove toast
        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);
        }, duration + 1000);

        // Remove toast when clicked
        toast.onclick = function (e) {
            if (e.target.closest(".toast__close")) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        const icons = {
            success: "fas fa-check-circle",
            info: "fas fa-info-circle",
            warning: "fas fa-exclamation-circle",
            error: "fas fa-exclamation-circle",
        };
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add("toast", `toast--${type}`);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

        toast.innerHTML = `
                      <div class="toast__icon">
                          <i class="${icon}"></i>
                      </div>
                      <div class="toast__body">
                          <h3 class="toast__title">${title}</h3>
                          <p class="toast__message">${message}</p>
                      </div>
                      <div class="toast__close">
                          <i class="fas fa-times"></i>
                      </div>
                  `;
        main.appendChild(toast);
    }
}

function addCartSuccess() {
    toast({
        title: "Thành công",
        message: "Bạn đã thêm thành công vào giỏ hàng",
        type: "success",
        duration: 1500,
    });
}

function buySuccess() {
    toast({
        title: "Thành công",
        message: "Bạn đã mua hàng thành công",
        type: "success",
        duration: 1500,
    });
}

function deleteProCart() {
    toast({
        title: "Thông tin",
        message: "Sản phẩm đã được xóa khỏi giỏ hàng",
        type: "info",
        duration: 1500,
    });
}

function deleteProBill() {
    toast({
        title: "Thông tin",
        message: "Đơn hàng đã được xóa thành công",
        type: "info",
        duration: 1500,
    });
}

function showWarningToast() {
    toast({
        title: "Thông báo",
        message: "Số lượng sản phẩm vượt qúa",
        type: "error",
        duration: 1500,
    });
}

function showErrorToast() {
    toast({
        title: "Thất bại",
        message: "Có lỗi! Vui lòng kiểm tra server!",
        type: "error",
        duration: 1500,
    });
}

export {
    addCartSuccess,
    buySuccess,
    deleteProCart,
    deleteProBill,
    showWarningToast,
    showErrorToast,
};
