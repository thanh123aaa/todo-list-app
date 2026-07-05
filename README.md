# Ứng dụng Quản lý công việc (Todo List App)

Dự án này là một ứng dụng Todo List hoàn chỉnh, được xây dựng theo mô hình Client-Server hiện đại:
- **Backend**: Java Spring Boot, RESTful API, JPA/Hibernate kết nối MySQL.
- **Frontend**: React, Vite, TypeScript, giao diện **Premium Dark Mode & Glassmorphism** (kính mờ) tương tác cao, thiết kế Responsive hiển thị tốt trên Mobile và Desktop.
- **Đóng gói & Triển khai**: Docker & Docker Compose.

---

## 🛠️ Công nghệ Sử dụng

### Backend:
- **Java 21** & **Spring Boot 3.3.1**
- **Spring Data JPA**: Tương tác với Database MySQL.
- **Spring Validation**: Kiểm tra tính hợp lệ dữ liệu đầu vào.
- **Lombok**: Giảm mã nguồn lặp (boilerplate code).
- **JUnit 5 & Mockito**: Viết Unit Test cho tầng Service và Controller.

### Frontend:
- **React 18** (Vite + TypeScript)
- **Vanilla CSS**: Quản lý phong cách giao diện tùy chỉnh cao cấp (variables, glassmorphic designs, responsive grids).
- **Fetch API**: Giao tiếp phi tuần tự (`async/await`) với backend REST API.

### DevOps & Database:
- **MySQL 8.0**
- **Docker** & **Docker Compose**
- **Nginx**: Phục vụ file tĩnh frontend và chuyển tiếp (proxy) API.

---

## ✨ Các Tính năng Chính

1. **Hiển thị danh sách**: Thiết kế dạng thẻ trực quan, hỗ trợ phân trang và tùy chỉnh số lượng dòng hiển thị.
2. **Thêm công việc mới**: Tiêu đề (bắt buộc), Mô tả, Độ ưu tiên (`LOW`, `MEDIUM`, `HIGH`) và Hạn hoàn thành (DueDate).
3. **Chỉnh sửa công việc**: Cập nhật mọi thông tin trên Modal popup động.
4. **Xóa công việc**: Xóa công việc kèm cảnh báo xác nhận.
5. **Cập nhật nhanh**: Đánh dấu hoàn thành / chưa hoàn thành tức thì chỉ với một cú click checkbox.
6. **Thống kê tiến độ**: Tổng số công việc, đã làm, chưa làm và thanh tiến độ (%) trực quan, sinh động.
7. **Tìm kiếm & Lọc nâng cao**:
   - Tìm kiếm từ khóa theo Tiêu đề hoặc Mô tả (áp dụng Debounce tránh spam API).
   - Lọc theo Trạng thái (Tất cả, Đang làm, Đã xong).
   - Lọc theo Mức độ ưu tiên (Thấp, Trung bình, Cao).
8. **Sắp xếp linh hoạt**: Theo ngày tạo, hạn hoàn thành, bảng chữ cái tiêu đề, mức độ ưu tiên (tăng dần/giảm dần).

---

## 🚀 Hướng dẫn Chạy ứng dụng

Có hai phương pháp để chạy ứng dụng trên máy của bạn:

### 🐳 Cách 1: Chạy bằng Docker Compose (Khuyên dùng - Nhanh nhất)
Bạn không cần cài đặt Java, Maven, Node.js hay MySQL thủ công. Chỉ cần máy tính đã cài đặt **Docker** và **Docker Compose**.

1. Mở terminal tại thư mục gốc của dự án.
2. Khởi chạy toàn bộ hệ thống bằng câu lệnh:
   ```bash
   docker compose up --build
   ```
3. Sau khi Docker khởi động hoàn tất (Frontend, Backend và DB sẽ tự động kết nối với nhau):
   - **Giao diện người dùng (React)**: Truy cập tại [http://localhost](http://localhost)
   - **REST API (Backend)**: Truy cập tại [http://localhost:8080/api/todos](http://localhost:8080/api/todos)

*Để dừng hệ thống, nhấn `Ctrl + C` và chạy `docker compose down`.*

---

### 💻 Cách 2: Chạy Thủ công trên Máy tính (Local)

#### Yêu cầu hệ thống:
- Java 17 hoặc Java 21 (Dự án viết trên Java 21)
- Maven 3.8+
- Node.js 18+ & npm
- Cơ sở dữ liệu MySQL đang chạy trên cổng 3306

#### Các bước thiết lập:

##### Bước 1: Khởi tạo Cơ sở dữ liệu
Truy cập MySQL của bạn và tạo một database mới:
```sql
CREATE DATABASE todo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
*(Nếu thông tin kết nối MySQL khác với mặc định `root` / `root`, hãy cập nhật trong file [application.properties](file:///C:/Users/thanh/Desktop/Bai%20test/backend/src/main/resources/application.properties)).*

##### Bước 2: Chạy Backend Spring Boot
1. Mở Terminal và di chuyển vào thư mục `backend/`:
   ```bash
   cd backend
   ```
2. Build và khởi chạy dự án:
   ```bash
   mvn spring-boot:run
   ```
   *Lớp Hibernate tự động khởi tạo bảng dữ liệu `todos` khi ứng dụng khởi chạy thành công trên cổng `8080`.*

##### Bước 3: Chạy Frontend React
1. Mở một cửa sổ Terminal mới và di chuyển vào thư mục `frontend/`:
   ```bash
   cd frontend
   ```
2. Cài đặt các thư viện liên quan:
   ```bash
   npm install
   ```
3. Khởi chạy server phát triển React:
   ```bash
   npm run dev
   ```
4. Truy cập giao diện ứng dụng tại: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Chạy Kiểm thử Tự động (Unit Test)

Dự án được viết đầy đủ Unit Test cho tầng nghiệp vụ (Service) và tầng định tuyến (Controller):

Di chuyển vào thư mục `backend/` và chạy lệnh sau:
```bash
mvn test
```
Maven sẽ chạy toàn bộ các ca kiểm thử trong thư mục `src/test` và xuất ra báo cáo kết quả trên console.

---

## 📂 Danh sách các API Endpoints (REST)

Tất cả các API sử dụng tiền tố `/api/todos`. Dữ liệu trao đổi định dạng JSON.

- `GET /api/todos`: Lấy danh sách nhiệm vụ.
  - Các tham số tùy chọn:
    - `search` (String): Từ khóa tìm kiếm.
    - `completed` (Boolean): Lọc trạng thái (`true`/`false`).
    - `priority` (String): Lọc độ ưu tiên (`LOW`/`MEDIUM`/`HIGH`).
    - `page` (Integer): Số trang (Bắt đầu từ `0`).
    - `size` (Integer): Số dòng trên trang.
    - `sortBy` (String): Sắp xếp theo trường (`createdAt`, `dueDate`, `title`, `priority`).
    - `direction` (String): Hướng sắp xếp (`ASC`/`DESC`).
- `GET /api/todos/{id}`: Lấy chi tiết một nhiệm vụ.
- `POST /api/todos`: Tạo nhiệm vụ mới.
- `PUT /api/todos/{id}`: Cập nhật nhiệm vụ hiện có.
- `PATCH /api/todos/{id}/toggle`: Chuyển nhanh trạng thái hoàn thành.
- `DELETE /api/todos/{id}`: Xóa nhiệm vụ.
