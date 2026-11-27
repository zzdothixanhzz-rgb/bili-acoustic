# CLAUDE.md — Bili Acoustic website

Website tĩnh (HTML/CSS/JS thuần + Vite 6, Node 22), deploy trên Cloudflare Pages qua GitHub. Hướng dẫn đầy đủ: `CLAUDE_DEPLOYMENT_GUIDE.md`.

## Mỗi lần làm việc
1. `git pull origin main` trước khi sửa.
2. Nội dung (giá, tài liệu, khoá học, tin tức) → `src/data.js`. Giao diện → `src/style.css`. Hành vi → `src/main.js`. Khung trang → `index.html`.
3. Chỉ sửa đúng phần được yêu cầu. Giữ nguyên giao diện và mọi chức năng khác.
4. Thay đổi rủi ro → nhánh `feat/...` + Preview URL → chờ chủ dự án duyệt rồi mới merge vào `main`.
5. `npm run build` phải thành công. Thay đổi giao diện → kiểm tra desktop và mobile 390px.
6. Xem `git diff --staged`: không secret, không `dist/`, `node_modules/`, `.env*`, `.dev.vars`.
7. Commit `feat|fix|content|docs|chore: <mô tả tiếng Việt>` → `git push`.
8. Chờ Cloudflare deploy, tự mở URL kiểm tra, rồi báo kết quả kèm URL.

## Cấm
- Đưa secret vào mã nguồn hay commit. `public/` là công khai.
- `git push --force` lên `main`, xoá lịch sử.
- Đăng ký dịch vụ trả phí khi chưa được đồng ý.
- Báo đã deploy mà chưa kiểm tra URL thật.

## Build
`npm run build` → `dist/`. Cloudflare: build `npm run build`, output `dist`, nhánh `main`.
