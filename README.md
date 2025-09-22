# QR Code Generator & Scanner (React + Vite + PWA)

Ứng dụng web cho phép **tạo mã QR** từ text/link và **quét mã QR** bằng camera.  
Xây dựng bằng **React + Vite**, hỗ trợ **offline (Service Worker)** và có thể **cài đặt như ứng dụng di động (PWA)**.

---

## Tính năng
- Tạo QR Code từ văn bản hoặc đường dẫn  
- Quét QR Code bằng camera  
- Hỗ trợ offline nhờ Service Worker  
- Cài đặt trên thiết bị di động (PWA)  
- Lưu dữ liệu cơ bản bằng localStorage  

---

## Công nghệ
- React 18 + Vite  
- react-qr-code  
- html5-qrcode  
- PWA (manifest.json + service-worker.js)  

---

## Cách dùng
1. Tải file `.zip` của project về máy  
2. Giải nén file `.zip`  
3. Mở thư mục bằng **Visual Studio Code**  
4. Trong terminal chạy:  
   ```bash
   npm install
   npm run dev
5. Mở http://localhost:5173

## Hỗ trợ Offline (PWA)
- service-worker.js tự động cache file tĩnh (HTML, CSS, JS, icon, manifest.json)
- Có thể mở lại khi offline sau lần tải đầu tiên
- Trên di động có thể Add to Home Screen để chạy như app native
