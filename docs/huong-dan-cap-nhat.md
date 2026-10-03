# Hướng dẫn cập nhật portfolio

Tài liệu cho chủ site (Devan). Nội dung trên site luôn bằng tiếng Anh; hướng dẫn này bằng tiếng Việt để dễ dùng.

## 1. Sửa nội dung: chỉ một file

Gần như mọi chữ trên site nằm trong `src/content/site.ts`. Mở file, tìm đúng khối, sửa phần chữ trong dấu ngoặc kép, lưu lại.

| Muốn sửa | Khối trong `site.ts` |
| --- | --- |
| Câu mở đầu trên ảnh Starry Night | `hero` (`lead`, `highlight` là phần tô vàng, `tail`) |
| Thẻ "The short version" | `summary` |
| Đoạn giới thiệu trong cửa sổ trình duyệt | `about` |
| Giải pháp quảng cáo Cốc Cốc | `solutions` |
| Cách làm việc với khách hàng | `workflow` |
| GA4, Tag Manager, Google Ads, Looker Studio | `growth` |
| WordPress và WooCommerce | `websites` |
| Hai công cụ (UTM, ước tính ngân sách) | `tools` |
| Kết quả, lời giới thiệu, sản phẩm mẫu | `proof` (xem mục 3) |
| Kỹ năng, chứng chỉ, học vấn, ngoại ngữ | `credentials` |
| CV | `cv` (xem mục 4) |
| Lời kêu gọi liên hệ cuối trang | `contact` |

Quy tắc nội dung (giữ nguyên, không ngoại lệ):

- Chỉ tên **Devan**. Không đưa tên thật hay email lên site; liên hệ chỉ qua LinkedIn.
- Tiếng Anh, viết hoa đầu câu, câu ngắn, không phóng đại.
- Không tên hay logo khách hàng, không case study.
- Không bịa số liệu. Số liệu minh họa trong các bảng mô phỏng luôn ghi "Sample".
- Chưa chắc thì để `TODO:` trong code, không đưa lên trang.

## 2. Việc còn chờ bạn xác nhận

Tìm chữ `TODO` trong `src/content/site.ts`:

1. Bạn có dùng **Looker Studio** để báo cáo không? Nếu không, bỏ bước "Report" trong `growth` và chữ "Looker Studio" ở `summary`, `credentials`, `cv`.
2. Bạn dựng WordPress bằng **block editor** (Gutenberg) hay **page builder** (Elementor…)? Nếu là page builder, sửa chữ trong `websites` cho đúng.
3. **Chứng chỉ**: thêm đơn vị cấp, năm và link xác minh (xem mục 3).

## 3. Thêm bằng chứng (phần đang ẩn)

Phần "Results and references" tự hiện khi có ít nhất một mục, và tự ẩn khi trống.

```ts
export const proof = {
  title: "Results and references",
  results: [
    // Con số bạn chứng minh được, kèm bối cảnh: làm gì, ở đâu, khi nào.
    { value: "XX%", label: "What the number measures", context: "Kind of campaign, channel, quarter and year" },
  ],
  testimonials: [
    // Chỉ khi người đó đồng ý bằng văn bản. Không ghi tên công ty khách hàng.
    { quote: "…", name: "Person's name", role: "Their role" },
  ],
  samples: [
    // Sản phẩm công khai bạn được phép chia sẻ.
    { title: "Short title", kind: "WooCommerce store", text: "…", url: "https://…" },
  ],
};
```

(Ví dụ trên chỉ là khuôn mẫu cách điền, thay bằng thông tin thật của bạn.)

Chứng chỉ có thể thêm đơn vị cấp, năm và link xác minh; trang web và CV tự hiển thị:

```ts
{ name: "SEO Certificate", issuer: "Issuer name", year: "Year", url: "https://…" },
```

## 4. CV và file PDF

- Trang `/cv/` lấy dữ liệu từ `cv` và `credentials` trong `site.ts`.
- File tải về `public/devan-cv.pdf` được tạo từ trang đó. **Mỗi lần sửa nội dung CV, tạo lại PDF:**

```bash
npm install
npx playwright install chromium   # lần đầu
NEXT_PUBLIC_SITE_URL=https://ten-mien-cua-ban npm run build
npx serve out -l 4173 &
node scripts/render-cv-pdf.mjs
```

Đặt `NEXT_PUBLIC_SITE_URL` để PDF in kèm địa chỉ website. Kiểm tra PDF vẫn đúng **1 trang A4** trước khi commit.

## 5. Gửi bản phù hợp từng vị trí ứng tuyển

Cùng nội dung, khác câu mở đầu và thứ tự phần:

| Ứng tuyển vị trí | Gửi link |
| --- | --- |
| Account management, ad sales | `/for/account-management/` |
| Performance marketing, analytics | `/for/performance-marketing/` |
| WordPress, web | `/for/web/` |

Các trang này không hiện trên Google (noindex), chỉ ai có link mới xem. Thêm phiên bản mới: chép một khối trong `src/content/roles.ts`, đổi `slug`, `label`, `hero` và `order`.

## 6. Xem trước và đưa lên mạng

```bash
npm run dev            # xem khi đang sửa: http://localhost:3000
npm run lint           # kiểm tra lỗi
npm run build          # bản thật, ra thư mục out/
```

Đưa lên mạng (Vercel, miễn phí cho site cá nhân):

1. Vào vercel.com, đăng nhập bằng GitHub, chọn **Add New Project**, chọn repo này. Cấu hình build đã có sẵn trong `vercel.json`.
2. **Settings → Git → Production Branch**: đặt là `main`.
3. Có tên miền riêng: **Settings → Domains** để gắn, rồi **Settings → Environment Variables** thêm `NEXT_PUBLIC_SITE_URL` = `https://ten-mien-cua-ban`, sau đó deploy lại.
4. Mỗi lần merge vào `main`, Vercel tự đưa bản mới lên.

Cloudflare Pages cũng được: build command `npm run build`, output `out`.

## 7. Nhờ Claude Code sửa

Mở Claude Code trong repo và nói việc cần làm, ví dụ: "thêm chứng chỉ Google Ads Search, cấp năm 2026, link …" hoặc "đổi câu mở đầu thành …". Claude đọc `CLAUDE.md` để giữ đúng các quy tắc trên.
