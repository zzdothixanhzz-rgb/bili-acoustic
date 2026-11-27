# CLAUDE_DEPLOYMENT_GUIDE.md — Hướng dẫn lâu dài cho Claude khi làm việc với website Bili Acoustic

> File này dành cho Claude (Claude Desktop / Claude Code) và cho chủ dự án.
> Khi cập nhật URL hoặc hạ tầng, sửa ngay file này trong cùng commit.

## 1. Thông tin dự án

| Mục | Giá trị |
|---|---|
| Tên | Bili Acoustic — tài liệu, khoá học, dịch vụ đo kiểm âm thanh |
| GitHub repo | `TODO: https://github.com/<tai-khoan>/bili-acoustic` |
| Production URL | `TODO: https://<du-an>.pages.dev` |
| Preview URL | `https://<ten-nhanh>.<du-an>.pages.dev` (tự sinh cho mỗi nhánh/PR) |
| Hosting | Cloudflare Pages (gói Free), kết nối GitHub |
| Nhánh production | `main` |
| Backend / API | Không có |
| Database | Không có |
| Biến môi trường | Không có. Tên dự phòng xem `.env.example` |

## 2. Kiến trúc & công nghệ

- Website tĩnh 1 trang: HTML + CSS + JavaScript thuần (ES module), build bằng **Vite 6**, Node 22.
- `index.html`: toàn bộ khung trang (header, showroom, các section, footer, giỏ hàng, trình đọc).
- `src/style.css`: toàn bộ giao diện. Bảng màu nằm trong biến CSS ở `:root` (`--ink`, `--gold`, `--champagne`…).
- `src/data.js`: **nội dung**, gồm `DOCS` (tài liệu), `COURSES`, `NEWS`, `CATS` (quầy), `HOT` (vùng bấm trên ảnh showroom, toạ độ 0–1).
- `src/main.js`: hành vi gồm lọc quầy, tìm kiếm, giỏ hàng (trong bộ nhớ), trình đọc tài liệu, menu mobile, toast, tooltip.
- `public/`: copy nguyên vào `dist/`. Gồm `showroom.jpg`, `favicon.svg`, `_headers` (header bảo mật/cache), `robots.txt`.
  - `public/docs/<thu-muc>/cover-01.jpg` và `p-01.jpg … p-NN.jpg` (ảnh trang 1000×1416), cùng `public/docs/<ten>.pdf`.
- `scripts/check-assets.mjs`: chạy trước build. Báo lỗi nếu thiếu file mà `data.js` tham chiếu, hoặc có file > 25 MiB.
- `.github/workflows/ci.yml`: CI chạy build và quét secret. CI không deploy.

## 3. Lệnh

```bash
npm install          # lần đầu / sau khi đổi package.json
npm run dev          # http://localhost:5173
npm run check        # chỉ kiểm tra tài nguyên
npm run build        # check + build → dist/
npm run preview      # xem dist tại http://localhost:4173
```

Trên Windows (PowerShell) dùng đúng các lệnh trên. Nếu `npm` bị chặn bởi ExecutionPolicy thì gọi `npm.cmd`.

## 4. Cấu hình Cloudflare Pages

Build command `npm run build` · Output `dist` · Root trống · Production branch `main` · Preview: bật cho mọi nhánh.
Build lỗi thì Cloudflare giữ nguyên bản production cũ.

## 5. Quy trình Git khi thay đổi (bắt buộc)

1. `git pull origin main` để lấy bản mới nhất.
2. Đọc các file liên quan, xác định đúng file cần sửa.
3. Thay đổi **nhỏ / an toàn** (sửa chữ, giá, thêm tin tức, thêm tài liệu): làm trực tiếp trên `main`.
   Thay đổi **có rủi ro** (đổi bố cục, sửa `main.js`, thêm backend, nâng cấp Vite): tạo nhánh `git switch -c feat/<mo-ta>`, push, gửi link Preview cho chủ dự án duyệt, chỉ merge vào `main` khi được đồng ý.
4. Sửa code, giữ nguyên chức năng khác, không sửa lan sang phần không liên quan.
5. `npm run build`: phải thành công. Nếu đổi giao diện, chạy `npm run preview` và kiểm tra cả desktop lẫn mobile (390px).
6. `git status` và `git diff --staged`: không có `node_modules/`, `dist/`, `.env`, `.dev.vars`, file lạ hay secret.
7. Commit theo dạng `feat: …`, `fix: …`, `content: …`, `docs: …`, `chore: …` và mô tả bằng tiếng Việt.
8. `git push`.
9. Chờ Cloudflare build xong (khoảng 1–2 phút). Mở production URL (hoặc preview URL), kiểm tra đúng phần vừa sửa.
10. Báo kết quả gồm: đã sửa gì, commit nào, URL đã kiểm tra.

## 6. Công thức thay đổi hay gặp

- **Sửa giá / mô tả / thêm tin tức / khoá học:** chỉ sửa `src/data.js`.
- **Thêm tài liệu mới:**
  1. Đặt PDF vào `public/docs/<ten>.pdf`.
  2. Xuất ảnh trang: `pdftoppm -jpeg -jpegopt quality=85 -scale-to-x 1000 -scale-to-y 1416 public/docs/<ten>.pdf public/docs/<thu-muc>/p` (tạo `p-01.jpg…`). Ảnh bìa `cover-01.jpg` rộng 400–480px.
  3. Thêm 1 dòng vào `DOCS` với `id` mới (`d13`…), `cat` thuộc `aut|loa|fix|thd|data`, và `read.pages` bằng đúng số trang.
  4. `npm run build` để script kiểm tra đủ file.
- **Đổi màu:** sửa biến trong `:root` của `src/style.css`.
- **Đổi vùng bấm showroom:** sửa `HOT` trong `data.js` (toạ độ tỉ lệ 0–1 theo ảnh 1800×900).

## 7. Xử lý sự cố

| Triệu chứng | Nguyên nhân thường gặp / cách xử lý |
|---|---|
| Cloudflare build lỗi ở bước check | Thiếu file mà `data.js` tham chiếu. Xem log dòng `THIẾU:` |
| Build lỗi "file too large" | Có file > 25 MiB. Nén PDF lại hoặc chuyển sang R2 |
| Trang trắng sau deploy | Mở DevTools Console. Thường do lỗi cú pháp trong `main.js` hoặc `data.js` |
| Ảnh 404 trên production | Sai hoa/thường trong tên file. Cloudflare phân biệt chữ hoa và chữ thường, Windows thì không |
| Font hiển thị sai | Google Fonts bị chặn ở mạng đó. Không phải lỗi của site |
| `npm` không chạy trên Windows | Cài Node 22 LTS từ nodejs.org, mở lại terminal |
| Push bị từ chối | Chạy `git pull --rebase origin main` rồi push lại. Không dùng `--force` |

## 8. Rollback

Dashboard Cloudflare → dự án → Deployments → bản cũ → **⋯ → Rollback**. Sau đó `git revert <commit>` rồi push để mã nguồn khớp. Chi tiết xem `DEPLOYMENT.md` mục 4.

## 9. Quy tắc bất biến

- Không đưa API key, mật khẩu, token vào `src/`, `public/`, `index.html` hay commit. Secret chỉ để trong Cloudflare Variables and Secrets hoặc `.dev.vars`.
- Không xoá hay đơn giản hoá chức năng có sẵn khi chưa được yêu cầu.
- Không `git push --force` lên `main`. Không xoá lịch sử Git.
- Không đăng ký hay nâng cấp dịch vụ trả phí khi chưa được chủ dự án đồng ý.
- Không báo "đã deploy xong" khi chưa tự mở production URL kiểm tra.
- Mọi file trong `public/` đều công khai. Không đặt tài liệu riêng tư vào đó.
