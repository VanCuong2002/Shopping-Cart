const provinceSelector = document.getElementById("province");
const districtSelector = document.getElementById("district");
const wardSelector = document.getElementById("ward");

async function fetchData(url) {
    try {
        const response = await fetch(url);
        return response.json();
    } catch (error) {
        console.error("Lỗi", error);
        return null;
    }
}

async function fetchOptions(selector, url, defaultValue, valueKey, textKey) {
    const res = await fetchData(url);
    if (res && res.results) {
        selector.innerHTML = `<option value="">--Chọn ${defaultValue}--</option>`;
        res.results.forEach((item) => {
            selector.innerHTML += `<option value="${item[valueKey]}">${item[textKey]}</option>`;
        });
    }
}

provinceSelector.addEventListener("change", (event) => {
    wardSelector.innerHTML = "<option value=''>--Chọn Phường/Xã--</option>";
    fetchOptions(
        districtSelector,
        `https://vapi.vnappmob.com/api/province/district/${event.target.value}`,
        "Quận/Huyện",
        "district_id",
        "district_name"
    );
});

districtSelector.addEventListener("change", (event) => {
    fetchOptions(
        wardSelector,
        `https://vapi.vnappmob.com/api/province/ward/${event.target.value}`,
        "Phường/Xã",
        "ward_id",
        "ward_name"
    );
});

(async () => {
    await fetchOptions(
        provinceSelector,
        "https://vapi.vnappmob.com/api/province/",
        "Tỉnh/Thành phố",
        "province_id",
        "province_name"
    );
})();
