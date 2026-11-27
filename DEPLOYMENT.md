# DEPLOYMENT.md — Báo cáo kiểm tra & hạ tầng triển khai

> **Cập nhật:** dự án được triển khai bằng **Cloudflare Workers (static assets)** qua Workers Builds, không dùng Cloudflare Pages. Cấu hình nằm trong `wrangler.jsonc` (phục vụ `dist/`). Build `npm run build`, deploy `npx wrangler deploy`, URL dạng `bili-acoustic.<tai-khoan>.workers.dev`. Giới hạn Free: 20.000 file và 25 MiB mỗi file. Các mục bên dưới nhắc tới Pages vẫn đúng về nguyên tắc (build, rollback, chi phí 0 đ).

_Cập nhật: 27/11/2026_

## 1. Kết quả kiểm tra dự án (Phase 1 — Audit)

| Hạng mục | Kết quả |
|---|---|
| Kiến trúc | Website **tĩnh 1 trang** (single page, điều hướng bằng `#anchor`). Không có server, không có cơ sở dữ liệu. |
| Ngôn ngữ | HTML, CSS, JavaScript (ES module). Không có TypeScript. |
| Framework | Không dùng framework giao diện. Dùng **Vite 6** để chạy thử và build. |
| Package manager | npm (có `package-lock.json`) |
| Node.js | 22 (ghi trong `.node-version`). Tối thiểu 18. |
| Lệnh build | `npm run build` (kiểm tra tài nguyên, sau đó chạy `vite build`) |
| **Thư mục đầu ra** | **`dist/`** |
| Phụ thuộc chạy thật | Chỉ có `vite` (devDependency). Trình duyệt không tải thư viện JS nào từ bên ngoài. |
| Dịch vụ ngoài | Google Fonts (CSS + font). Không có API nào khác. |
| Backend / API | **Không cần.** Thanh toán, đăng nhập và "Đọc tiếp" hiện chỉ là giao diện mẫu (xem mục 5). |
| Database | **Không cần** ở trạng thái hiện tại. |
| Bí mật (API key, mật khẩu, token) | **Không có.** Đã quét `src/`, `index.html` và các file cấu hình. |
| Dung lượng | Khoảng 50 MB, 305 file trong `dist/`. File lớn nhất khoảng 2,4 MB, dưới giới hạn 25 MiB/file của Cloudflare Pages. |
| Tương thích Cloudflare Pages | ✅ Hoàn toàn tương thích. Đã build và kiểm thử trên trình duyệt (desktop 1440px, mobile 390px). |

### Vấn đề kỹ thuật đã biết
1. **Tài liệu bán phí đang công khai.** PDF và ảnh từng trang nằm trong `public/docs/`, ai có link đều tải được. Giải pháp nằm ở mục 5.
2. **`public/docs/hop-cach-am-va-fixture.pdf` là bản tạm** ghép từ ảnh, nên chữ không chọn hay tìm kiếm được. Cần thay bằng file gốc 8,4 MB, xem README mục 7.
3. Email và số điện thoại hiển thị dạng chữ thường, có thể bị bot thu thập để gửi spam. Đây là chấp nhận được với trang giới thiệu.

## 2. Kiến trúc triển khai

```
 Máy tính (Claude Desktop / Claude Code)
        │  git push
        ▼
 GitHub repo (private)  ──►  GitHub Actions: CI chạy npm run build (chỉ kiểm tra, không deploy)
        │  webhook
        ▼
 Cloudflare Pages
   • nhánh main        →  Production:  https://<du-an>.pages.dev
   • nhánh khác / PR   →  Preview:     https://<nhanh>.<du-an>.pages.dev
```

- **Production branch:** `main`. Mỗi lần push lên `main`, Cloudflare tự build rồi deploy.
- **Preview:** mỗi nhánh khác hoặc mỗi Pull Request có URL xem thử riêng. Production không bị ảnh hưởng.
- **Build lỗi:** Cloudflare **không** thay bản đang chạy. Bản production cũ vẫn phục vụ người xem.
- `npm run build` dừng ngay nếu thiếu ảnh/PDF hoặc có file quá 25 MiB. Nhờ đó Cloudflare không bao giờ deploy một bản thiếu tài nguyên.

### Cấu hình Cloudflare Pages

| Mục | Giá trị |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(trống)* |
| Production branch | `main` |
| Biến môi trường | `NODE_VERSION=22` (tuỳ chọn, vì đã có `.node-version`) |

## 3. Chi phí dự kiến: **0 đ/tháng**

Gói Free của Cloudflare Pages (tra cứu ngày 27/11/2026):
- 500 lượt build/tháng, mỗi lần 1 build, timeout 20 phút.
- Request tới file tĩnh và băng thông **không giới hạn**.
- Tối đa 20.000 file/site, 25 MiB/file.
- 100 tên miền riêng/dự án.

GitHub: repo private miễn phí.
Tên miền riêng (`.com`, `.vn`…) là tuỳ chọn, phải mua riêng. Chưa cần, dùng `*.pages.dev` trước.

## 4. Rollback (quay về bản cũ)

**Cách 1, nhanh nhất (Dashboard):** Cloudflare → Workers & Pages → dự án → **Deployments** → chọn bản production cũ → **⋯ → Rollback to this deployment**. Có hiệu lực ngay, không cần build lại.

**Cách 2 (Git):** để mã nguồn khớp với bản đang chạy:
```bash
git revert <commit-lỗi>      # tạo commit đảo ngược, không xoá lịch sử
git push origin main         # Cloudflare tự build và deploy lại
```
Không dùng `git push --force` lên `main`.

## 5. Khi nào cần backend (đề xuất, CHƯA triển khai)

Hiện trang chạy hoàn toàn được mà không cần API. Backend chỉ cần khi bạn bắt đầu **bán thật**. Mỗi bước dưới đây cần bạn chọn và đăng ký tài khoản nhà cung cấp, nên chưa làm.

| Nhu cầu | Giải pháp đề xuất | Free tier (Cloudflare, tra ngày 27/11/2026) |
|---|---|---|
| Tạo đơn hàng, mã VietQR, nhận webhook đã thanh toán | Pages Functions (`functions/api/*`) + cổng PayOS / SePay / Casso | Functions tính chung quota Workers Free: 100.000 request/ngày, 10 ms CPU/request |
| Lưu đơn hàng, người mua | Cloudflare D1 | Có gói Free. Vượt hạn mức ngày thì truy vấn báo lỗi tới 00:00 UTC |
| Bảo vệ PDF đầy đủ | Cloudflare R2 (bucket private) + Function cấp link tải sau khi đã thanh toán | Kiểm tra lại giá R2 khi triển khai |
| Đăng nhập | Supabase Auth / Clerk / Firebase Auth | Theo gói Free của nhà cung cấp, kiểm tra trước khi chọn |
| Form liên hệ | Pages Function + Turnstile + dịch vụ gửi email | — |

Phí cổng thanh toán (PayOS/SePay…) **chưa được kiểm tra**. Cần xem bảng giá chính thức trước khi chọn.

Quy tắc secret: khai báo trong **Cloudflare → Settings → Variables and Secrets** (production và preview riêng). Ở máy local thì để trong `.dev.vars` (đã có trong `.gitignore`). Tên biến xem `.env.example`.
