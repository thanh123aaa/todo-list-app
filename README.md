# Todo List App

Ứng dụng quản lý công việc (Todo List) được xây dựng bằng Java Spring Boot (Backend) và React + TypeScript (Frontend).

- **Demo trực tuyến**: [https://todo-list-app-five-omega.vercel.app/](https://todo-list-app-five-omega.vercel.app/)

## Các tính năng chính
- **CRUD công việc**: Thêm, sửa, xóa, và xem chi tiết công việc.
- **Lọc & Tìm kiếm**:
  - Tìm kiếm thời gian thực theo tiêu đề và mô tả (có debounce 400ms tránh spam API).
  - Lọc theo trạng thái (Tất cả, Đang làm, Đã xong) và mức độ ưu tiên (Cao, Trung bình, Thấp).
  - Sắp xếp động theo ngày tạo, hạn hoàn thành, tiêu đề, độ ưu tiên.
- **Đặt lịch công việc**: Chọn ngày và giờ cụ thể (hạn chót), có kiểm tra chặn chọn thời gian trong quá khứ.
- **Trải nghiệm người dùng**: Phân trang động, hộp thoại xác nhận xóa tùy chỉnh, và thiết kế responsive.

## Cấu trúc dự án
- `backend/`: API RESTful viết bằng Spring Boot 3.3.1, Java 21, JPA/Hibernate kết nối MySQL.
- `frontend/`: Giao diện viết bằng React 18, Vite, TypeScript.
- `database/`: Chứa file `schema.sql` khởi tạo bảng và dữ liệu mẫu.

---

## Hướng dẫn chạy nhanh bằng Docker
Yêu cầu máy tính đã cài đặt Docker và Docker Compose. Chạy lệnh sau tại thư mục gốc:

```bash
docker compose up --build
```
- **Frontend**: [http://localhost](http://localhost)
- **Backend API**: [http://localhost:8080/api/todos](http://localhost:8080/api/todos)

---

## Hướng dẫn chạy thủ công (Local Development)

### 1. Cấu hình Database
Tạo cơ sở dữ liệu MySQL cục bộ:
```sql
CREATE DATABASE todo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
*Cấu hình tài khoản/mật khẩu MySQL trong tệp `backend/src/main/resources/application.properties`.*

### 2. Khởi chạy Backend
Yêu cầu JDK 21 và Maven 3.8+:
```bash
cd backend
mvn spring-boot:run
```
Backend sẽ khởi động tại cổng `8080`.

### 3. Khởi chạy Frontend
Yêu cầu Node.js 18+ và npm:
```bash
cd frontend
npm install
npm run dev
```
Truy cập giao diện tại: [http://localhost:5173](http://localhost:5173).

### 4. Chạy Unit Test (Backend)
```bash
cd backend
mvn test
```
