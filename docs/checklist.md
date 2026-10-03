# Checklist định kỳ và kiểm tra trên thiết bị thật

## Mỗi quý (15 phút)

Nội dung

- [ ] Chức danh, công ty, mốc thời gian trong `site` và `cv` còn đúng không? Đổi việc thì cập nhật ngay, kể cả CV PDF.
- [ ] Có kết quả mới chứng minh được, lời giới thiệu đã xin phép, hay sản phẩm công khai để thêm vào `proof` không?
- [ ] Chứng chỉ mới? Thêm vào `credentials.certifications` kèm đơn vị cấp, năm, link xác minh.
- [ ] Còn `TODO` nào trong `src/content/site.ts` chưa xử lý?
- [ ] Học MBA: cập nhật tiến độ trong `credentials.education` (và `summary.education`).
- [ ] Đọc lại câu mở đầu: còn đúng với việc bạn muốn được tuyển vào không? Nếu đang tìm việc, xem lại 3 bản trong `src/content/roles.ts`.

Kỹ thuật

- [ ] `npm outdated` rồi nâng cấp bản vá (patch/minor); chạy `npm run lint` và `npm run build`.
- [ ] `npm audit --omit=dev` không còn lỗi mức high.
- [ ] CI trên GitHub xanh ở `main`.
- [ ] Link LinkedIn vẫn mở đúng trang.
- [ ] Tạo lại `public/og.jpg` nếu câu mở đầu đổi (`scripts/render-og.mjs`) và `public/devan-cv.pdf` nếu CV đổi (`scripts/render-cv-pdf.mjs`).

## Trước khi gửi hồ sơ ứng tuyển

- [ ] Mở link bản phù hợp vị trí (`/for/...`) trên điện thoại, đọc lướt từ đầu đến cuối.
- [ ] Tải CV PDF, mở thử: 1 trang, đúng thông tin, có link LinkedIn và website.
- [ ] Dán link vào LinkedIn hoặc Zalo xem ảnh xem trước (OG image) hiện đúng.

## Kiểm tra trên thiết bị thật (sau mỗi thay đổi lớn về giao diện)

Thiết bị

- [ ] iPhone (Safari), một bản iOS gần đây.
- [ ] Android tầm trung (Chrome), máy yếu hơn là tốt nhất.
- [ ] Laptop: Chrome, Safari hoặc Firefox, Cốc Cốc.
- [ ] Màn hình lớn (từ 1440px) và một tablet nếu có.

Với mỗi thiết bị

- [ ] Mở trang chủ: bức tranh Starry Night hiện trong khoảng 2 giây, chữ đọc rõ, không bị che.
- [ ] Cuộn hết trang: các hạt chuyển cảnh mượt, không giật lâu, không có khoảng trắng lạ.
- [ ] Nút Pause motion: bấm thì mọi chuyển động dừng; tải lại trang vẫn giữ trạng thái dừng.
- [ ] Bật "Giảm chuyển động" (iOS: Cài đặt → Trợ năng → Chuyển động; Android: Hỗ trợ tiếp cận → Xóa hiệu ứng động): trang hiện bản tĩnh, đủ nội dung.
- [ ] Hai công cụ: tạo link UTM, bấm Copy link, dán thử; nhập ngân sách và giá, kết quả hiện đúng.
- [ ] Trang `/cv/`: Download PDF tải được; Print mở hộp in và bản in vừa 1 trang A4.
- [ ] Phần Contact: chân dung hạt nhìn theo con trỏ (máy tính) và nút LinkedIn mở tab mới.
- [ ] Không có thanh cuộn ngang ở bất kỳ đâu.
- [ ] Pin và nhiệt: để trang mở 2 phút, máy không nóng bất thường (WebGL tự giảm chất lượng trên máy yếu và dừng khi chuyển tab).
