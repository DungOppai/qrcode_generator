# QR Code Generator & Scanner — React (Vite)
- Tạo QR code từ text hoặc link.
- Lưu lịch sử QR code đã tạo (localStorage).
- Quét QR code bằng camera (camera permission required).
- Hỗ trợ offline: cache assets + app shell bằng Service Worker.


## Tech stack
- React (Vite)
- `qrcode.react` để generate QR code
- `html5-qrcode` để scan từ camera
- Service Worker để cache (manual simple caching)


## Cài đặt & chạy
1. Cài node 16+ và npm/yarn.
2. Tạo project, copy mã nguồn trong repo này.
3. Cài dependencies:


```bash
npm install
# or
# yarn
```


4. Chạy dev:


```bash
npm run dev
```


5. Build & serve production (static):


```bash
npm run build
npm run preview
```


> Lưu ý: để test tính năng scan camera, mở trang trong HTTPS hoặc `localhost`.


## Offline & PWA
- Service worker đơn giản cache các file tĩnh và trả về cache khi offline.
- Để đóng gói thành PWA hoàn chỉnh, bạn có thể thêm manifest, icon và logic update service worker (workbox).


## Lưu trữ dữ liệu
- Ứng dụng lưu lịch sử QR code (text + timestamp) vào `localStorage`.
