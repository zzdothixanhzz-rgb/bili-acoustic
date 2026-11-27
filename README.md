# Bili Acoustic — Website

Website giới thiệu và bán tài liệu, khoá học, dịch vụ kỹ thuật đo kiểm âm thanh.
Dự án được chuyển từ bản Claude Artifact sang một dự án **Vite** độc lập, có thể đưa lên GitHub và triển khai trên **Cloudflare Pages**.

Tài liệu liên quan:
- [`DEPLOYMENT.md`](DEPLOYMENT.md): báo cáo kiểm tra, kiến trúc triển khai, chi phí, rollback, đề xuất backend.
- [`CLAUDE_DEPLOYMENT_GUIDE.md`](CLAUDE_DEPLOYMENT_GUIDE.md): quy trình sửa → build → push → deploy → kiểm tra cho Claude và chủ dự án.
- [`CLAUDE.md`](CLAUDE.md): các quy tắc ngắn Claude phải theo mỗi lần làm việc với dự án.

Giao diện, màu sắc, bố cục và chức năng giữ nguyên như bản Artifact. Trang dùng HTML + CSS + JavaScript thuần, không dùng React. Bản gốc vốn không dùng framework, nên chuyển sang React chỉ thêm rủi ro mà không có lợi.

---

## 1. Cấu trúc thư mục

```
bili-acoustic/
├── index.html              # Khung trang (HTML)
├── package.json            # Lệnh npm: dev / build / preview / check
├── vite.config.js          # Cấu hình build, thư mục đầu ra: dist
├── .node-version           # Node 22 (Cloudflare Pages đọc file này)
├── src/
│   ├── style.css           # Toàn bộ CSS
│   ├── data.js             # NỘI DUNG: tài liệu, khoá học, tin tức, giá, vùng bấm showroom
│   └── main.js             # Hành vi: lọc quầy, tìm kiếm, giỏ hàng, trình đọc tài liệu…
├── public/                 # Copy nguyên vào bản build
│   ├── showroom.jpg        # Ảnh showroom (hero)
│   ├── favicon.svg
│   ├── _headers            # Header bảo mật + cache cho Cloudflare Pages
│   ├── robots.txt
│   └── docs/               # 12 PDF + ảnh bìa + ảnh từng trang của 12 tài liệu
└── scripts/
    └── check-assets.mjs    # Kiểm tra đủ file và không file nào vượt 25 MiB
```

**Sửa nội dung** (giá, mô tả, thêm tài liệu, khoá học, tin tức): chỉ cần sửa `src/data.js`.

---

## 2. Chạy trên máy

Yêu cầu: Node.js 18 trở lên (khuyên dùng 22).

```bash
npm install        # cài Vite (chỉ lần đầu)
npm run dev        # chạy thử tại http://localhost:5173
npm run build      # kiểm tra tài nguyên rồi build ra thư mục dist/
npm run preview    # xem bản build tại http://localhost:4173
```

`npm run build` sẽ **dừng lại và báo lỗi** nếu thiếu ảnh/PDF mà trang có tham chiếu, hoặc có file quá 25 MiB (giới hạn của Cloudflare Pages).

---

## 3. Đưa lên GitHub

```bash
cd bili-acoustic
git init
git add .
git commit -m "Bili Acoustic website"
git branch -M main
git remote add origin https://github.com/<tai-khoan>/bili-acoustic.git
git push -u origin main
```

Không cần commit `node_modules/` và `dist/` (đã có trong `.gitignore`).

---

## 4. Triển khai trên Cloudflare Pages

1. Vào **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**.
2. Chọn repository `bili-acoustic`.
3. Cấu hình build:

   | Mục | Giá trị |
   |---|---|
   | Framework preset | **Vite** (hoặc None) |
   | Build command | `npm run build` |
   | **Build output directory** | **`dist`** |
   | Root directory | *(để trống)* |
   | Biến môi trường (tuỳ chọn) | `NODE_VERSION` = `22` |

4. Bấm **Save and Deploy**. Sau khoảng 1 phút trang chạy tại `https://<ten-du-an>.pages.dev`.
5. Gắn tên miền riêng: **Custom domains → Set up a custom domain**.

Mỗi lần `git push` lên nhánh `main`, Cloudflare tự build và cập nhật trang.

**Cách khác, không qua GitHub:** chạy `npm run build` trên máy, rồi vào **Create → Pages → Upload assets** và kéo thả thư mục `dist/`.

---

## 5. Danh sách chức năng (đã kiểm tra trên máy tính 1440px và điện thoại 390px)

- Showroom 3D có 8 vùng bấm (6 quầy, bàn trưng bày, quầy tư vấn). Rê chuột vào quầy sẽ hiện tooltip. Dùng được bằng bàn phím (Tab + Enter).
- Thanh chọn quầy (7 chip) lọc danh sách tài liệu.
- Ô tìm kiếm tài liệu, có thông báo khi không có kết quả. Ô này ẩn trên màn hình dưới 680px, giống bản gốc.
- 12 thẻ tài liệu có ảnh bìa thật.
- Trình đọc tài liệu: xem toàn bộ trang (20–31 trang), có bộ đếm trang và nút "Mở bản PDF". Đóng bằng ✕ hoặc phím Esc.
- 4 khoá học (đang mở, sắp mở, đã kết thúc), 6 tin tức.
- Giỏ hàng: thêm, báo khi thêm trùng, bỏ khỏi giỏ, tính tổng tiền, huy hiệu số lượng.
- Nút chat nổi (Zalo, Email), menu thu gọn trên điện thoại, thông báo toast.

---

## 6. Phần chưa có backend: hiện trạng và cách chuyển đổi

Trang **không** gọi Claude API, **không** có cơ sở dữ liệu, **không** chứa API key hay mật khẩu nào. Các chức năng dưới đây trong bản Artifact chỉ là **giao diện mẫu** và được giữ nguyên như vậy:

| Chức năng | Hiện trạng | Đề xuất khi làm thật |
|---|---|---|
| **Thanh toán** | Bấm "Thanh toán" chỉ hiện ghi chú | Dùng **Cloudflare Pages Functions** (thư mục `functions/`) để tạo đơn hàng và mã VietQR qua **PayOS**, **SePay** hoặc **Casso**. Nhận webhook xác nhận đã chuyển khoản. Lưu đơn vào **Cloudflare D1**. |
| **Đăng nhập** | Chỉ hiện toast | **Supabase Auth**, **Clerk** hoặc **Firebase Auth** (đăng nhập Google hoặc email). Với trang quản trị nội bộ, có thể dùng **Cloudflare Access**. |
| **Giỏ hàng** | Lưu trong bộ nhớ, mất khi tải lại trang | Lưu `localStorage` cho khách. Khi có đăng nhập thì lưu vào D1. |
| **Tin tức "Đọc tiếp"** | Chỉ hiện toast | Thêm trang bài viết, viết bằng Markdown hoặc dùng CMS miễn phí (Decap CMS, Sanity). |
| **Liên hệ, đặt lịch khảo sát** | Chỉ hiển thị email và số điện thoại | Form liên hệ gửi qua Pages Function tới email (Resend hoặc MailChannels), có **Cloudflare Turnstile** chống spam. |

**Quy tắc bảo mật khi thêm backend:** API key và secret (PayOS, Resend, Supabase service key…) chỉ đặt trong **Cloudflare → Settings → Variables and Secrets**, rồi đọc trong `functions/` qua `context.env`. **Không** để trong `src/`, vì mọi thứ trong `src/` và `public/` đều công khai trên trình duyệt. File `.env` và `.dev.vars` đã có trong `.gitignore`.

### ⚠️ Lưu ý quan trọng về tài liệu bán phí

Giống bản Artifact, **toàn bộ 12 PDF và ảnh từng trang đều công khai**. Ai có đường link (ví dụ `/docs/thd-va-rub-buzz.pdf`) đều tải được mà không cần mua. Trên Internet, các file này có thể bị bot hoặc công cụ tìm kiếm thu thập.

Đề xuất khi bắt đầu bán thật:
1. Chỉ để công khai **ảnh bìa và 2–3 trang xem thử** trong `public/docs/`.
2. Chuyển PDF đầy đủ sang **Cloudflare R2** (bucket riêng tư).
3. Viết Pages Function `/api/download/:docId`: kiểm tra người dùng đã thanh toán (dữ liệu trong D1), rồi trả file hoặc link R2 có chữ ký, hết hạn sau vài phút.
4. Sửa `src/data.js`: trường `read.pages` chỉ đếm số trang xem thử, nút "Mở bản PDF" trỏ tới `/api/download/...`.

---

## 7. Ghi chú về tài nguyên đã chuyển

- `showroom.jpg`, 12 ảnh bìa, cả 12 file PDF và 23 ảnh trang của tài liệu *Hộp cách âm và fixture* được chép **nguyên bản** từ Artifact (đã đối chiếu SHA-256).
- Ảnh trang của 11 tài liệu còn lại được **xuất lại từ chính file PDF gốc** ở cùng kích thước 1000×1416. Sai khác trung bình so với ảnh cũ khoảng 0,8%, tức chỉ là nhiễu nén JPEG, mắt thường không phân biệt được.
- `public/docs/hop-cach-am-va-fixture.pdf` là **bản gốc**, đã đối chiếu SHA-256 với file trên Artifact.
- Font chữ (Cormorant Garamond, Be Vietnam Pro) tải từ Google Fonts, cần có Internet.
