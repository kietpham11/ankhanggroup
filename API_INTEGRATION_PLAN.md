# Kế hoạch Tích hợp API & Đề xuất Admin Panel

Giai đoạn Frontend (Giao diện) đã cơ bản hoàn thiện và hoạt động tốt với dữ liệu giả (Mock Data). Giai đoạn tiếp theo là xây dựng cơ chế gọi API để đổ dữ liệu thực từ Backend (Node.js/Express) vào giao diện và hoàn thiện hệ thống Admin để quản lý.

## Đề xuất các Module cần có cho Admin Panel
Để có thể quản lý 100% nội dung hiển thị trên trang web (Dynamic Content), Admin Panel cần có các module sau:

### 1. Quản lý Dự án (Projects)
*   **Chức năng**: Thêm, Sửa, Xóa, Ẩn/Hiện dự án.
*   **Trường dữ liệu**: Tên dự án, Loại hình (Căn hộ, Nhà phố...), Khu vực, Diện tích, Giá bán, Trạng thái (Đang mở bán, Sắp ra mắt).
*   **Đặc biệt**: Quản lý bộ sưu tập hình ảnh (Gallery), tiện ích, thông số vay ngân hàng mặc định của từng dự án.

### 2. Quản lý Tin tức & Kiến thức (Posts/News)
*   **Chức năng**: Trình soạn thảo văn bản phong phú (Rich Text Editor như CKEditor hoặc TinyMCE) để viết bài.
*   **Trường dữ liệu**: Tiêu đề, Ảnh bìa, Danh mục (Thị trường, Phong thủy, Kinh nghiệm...), Tóm tắt, Nội dung chi tiết, Ngày đăng, Tác giả.

### 3. Quản lý Tuyển dụng (Recruitment)
*   **Chức năng**: Đăng tin tuyển dụng mới.
*   **Trường dữ liệu**: Vị trí tuyển dụng, Phòng ban, Mức lương, Hạn nộp hồ sơ, Mô tả công việc, Yêu cầu.
*   **Quản lý hồ sơ (CV)**: Xem danh sách ứng viên đã nộp đơn, tải CV xuống, cập nhật trạng thái (Đã phỏng vấn, Đã từ chối).

### 4. Quản lý Liên hệ (Contacts/Leads)
*   **Chức năng**: Nơi hứng toàn bộ data từ form liên hệ của khách hàng (Trang chủ, Trang Liên hệ).
*   **Trường dữ liệu**: Tên, Số điện thoại, Email, Dự án quan tâm, Nội dung.
*   **Tính năng**: Gắn thẻ trạng thái (Chưa xử lý, Đang tư vấn, Đã chốt).

### 5. Quản lý Cài đặt Website (Settings/Banners)
*   **Chức năng**: Quản lý các thông tin tĩnh nhưng thỉnh thoảng cần thay đổi mà không cần nhờ Coder.
*   **Bao gồm**: Đội ngũ lãnh đạo (About), Danh sách logo đối tác, Các con số thống kê ở trang chủ (Số dự án, Số sản phẩm).
*   **Cấu hình**: Hotline, Email liên hệ dưới footer.

### 6. Quản lý Phân quyền (Users/Roles)
*   **Chức năng**: Quản lý tài khoản đăng nhập vào Admin.
*   **Phân quyền**: Admin (Toàn quyền), Content (Chỉ viết bài), Sale (Chỉ xem data khách hàng liên hệ).

---

## Kế hoạch Tích hợp API (Implementation Plan)

### Giai đoạn 1: Chuẩn bị & Cấu hình Frontend
- **Cài đặt thư viện**: Cài đặt `axios` để thực hiện các HTTP requests. Cài đặt `react-query` (Tùy chọn, khuyến nghị) để quản lý state của server, caching và loading state dễ dàng hơn.
- **Tạo Axios Instance**: Cấu hình `src/services/api.ts` với `baseURL`, tự động đính kèm `Authorization: Bearer <token>` vào headers.

### Giai đoạn 2: Tích hợp API theo từng Module (Ưu tiên từ dễ đến khó)
1. **Module Tin tức (News)**: 
   - Thay thế `mockNews` bằng API `GET /api/posts`.
   - Lấy chi tiết bài viết `GET /api/posts/:id`.
2. **Module Dự án (Projects)**: 
   - Thay thế `mockProjects` bằng API `GET /api/projects`.
   - Thêm query params cho bộ lọc (VD: `GET /api/projects?type=Căn+hộ&location=HCM`).
   - Chi tiết dự án `GET /api/projects/:id`.
3. **Module Liên hệ (Contacts)**: 
   - Gắn API `POST /api/contacts` vào Form liên hệ trang chủ và trang Contact.
   - Thêm thông báo Toast (Success/Error) khi submit form.
4. **Module Tuyển dụng (Jobs)**:
   - Thay `mockJobs` bằng `GET /api/jobs`.
   - Gắn API `POST /api/jobs/apply` vào Modal nộp CV.
5. **Module Xác thực (Auth)**:
   - Gắn API `POST /api/auth/login` vào AuthModal. Lưu Token vào LocalStorage hoặc Cookie. Cập nhật giao diện Header (hiển thị Avatar user thay vì nút Đăng nhập).

### Giai đoạn 3: Kiểm thử & Tối ưu (Verify & Optimize)
- Test toàn bộ các luồng lấy dữ liệu.
- Xử lý các trạng thái: Loading (Hiển thị Skeleton/Spinner) và Error (Hiển thị thông báo lỗi thân thiện).

---
## VUI LÒNG TRẢ LỜI ĐỂ TIẾP TỤC:

1. Bạn muốn dùng thư viện gọi API cơ bản (`axios`) hay dùng thêm `React Query` (chuyên nghiệp hơn, quản lý state tốt hơn)?
2. Backend hiện tại của bạn đã code xong những API nào rồi? (Tôi thấy có file routes cho projects, posts, contacts, auth).
3. Với phần Admin Panel, bạn định tự thiết kế giao diện riêng (thư mục `/admin`) hay dùng template có sẵn?
