const localStorageKeys = {
    productList: "DANHSACHSP",
    cartItems: "DANHSACHITEMCART",
    listBill: "DANHSACHDONHANG",
};

const dataLocal = (() => {
    const saveDataLocal = (inputData, typeData) => {
        const key =
            typeData === "cart"
                ? localStorageKeys.cartItems
                : localStorageKeys.productList;
        localStorage.setItem(key, JSON.stringify(inputData));
    };

    const getDataLocal = (typeData) => {
        const key =
            typeData === "cart"
                ? localStorageKeys.cartItems
                : localStorageKeys.productList;
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (error) {
            console.error(
                `Lỗi khi phân tích dữ liệu từ Local Storage: ${error}`
            );
            return [];
        }
    };

    const saveDataBillLocal = (inputData) => {
        const key = localStorageKeys.listBill;
        return localStorage.setItem(key, JSON.stringify(inputData));
    };

    const getDataBillLocal = () => {
        const key = localStorageKeys.listBill;
        return JSON.parse(localStorage.getItem(key)) || [];
    };

    const postApi = async (api, data) => {
        try {
            const response = await fetch(api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            return await response.json();
        } catch (error) {
            console.error("Error posting API:", error);
            return null;
        }
    };

    const removeApi = async (id) => {
        try {
            const response = await fetch(`${apiBill}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Error delete");
            }

            return await response.json();
        } catch (error) {
            console.error("Error deleting API:", error);
            return null;
        }
    };

    return {
        saveDataLocal,
        saveDataBillLocal,
        getDataLocal,
        getDataBillLocal,
        postApi,
        removeApi,
    };
})();

export { dataLocal };
