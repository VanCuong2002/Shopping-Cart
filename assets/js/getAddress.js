// Khai báo biến
const provinceSelector = document.getElementById("province");
const districtSelector = document.getElementById("district");
const wardSelector = document.getElementById("ward");

async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}

// 1. Lấy dữ liệu thành phố
async function fetchProvince() {
    try {
        const res = await fetchData(`https://vapi.vnappmob.com/api/province/`);
        res.results.map((item) => {
            provinceSelector.innerHTML += `
                            <option value="${item.province_id}">${item.province_name}</option>
                        `;
        });
    } catch (error) {
        console.error("Lỗi", error);
    }
}

// 2. Lấy huyện theo id tỉnh
async function fetchDistrict(idProvince) {
    const res = await fetchData(
        `https://vapi.vnappmob.com/api/province/district/${idProvince}`
    );
    const district = res.results;
    districtSelector.innerHTML = `<option value="">--Chọn Quận/Huyện--</option>`;
    if (district !== undefined) {
        district.map((item) => {
            districtSelector.innerHTML += `
                        <option value="${item.district_id}">${item.district_name}</option>
                    `;
        });
    }
}

// 3. Lấy phường theo id huyện
async function fetchWard(idDistrict) {
    const res = await fetchData(
        `https://vapi.vnappmob.com/api/province/ward/${idDistrict}`
    );
    const ward = res.results;
    wardSelector.innerHTML = `<option value="">--Chọn Phường/Xã--</option>`;
    if (ward !== undefined) {
        ward.map((item) => {
            wardSelector.innerHTML += `
                        <option value="${item.ward_id}">${item.ward_name}</option>
                    `;
        });
    }
}

// Event change
provinceSelector.addEventListener("change", (event) => {
    wardSelector.innerHTML = "<option value=''>--Chọn Phường/Xã--</option>";
    fetchDistrict(event.target.value);
});

districtSelector.addEventListener("change", (event) => {
    fetchWard(event.target.value);
});

// Gọi hàm fetchProvince để lấy dữ liệu tỉnh/thành phố khi trang được tải
fetchProvince();
