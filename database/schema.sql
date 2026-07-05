-- Script khởi tạo cơ sở dữ liệu cho dự án Todo List

-- 1. Tạo cơ sở dữ liệu nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS `todo_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `todo_db`;

-- 2. Tạo bảng todos lưu trữ danh sách công việc
CREATE TABLE IF NOT EXISTS `todos` (
    `id` BIGINT AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL COMMENT 'Tiêu đề công việc',
    `description` TEXT NULL COMMENT 'Mô tả chi tiết công việc',
    `completed` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Trạng thái hoàn thành (true/false)',
    `priority` VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' COMMENT 'Độ ưu tiên (LOW, MEDIUM, HIGH)',
    `due_date` DATE NULL COMMENT 'Hạn chót hoàn thành công việc',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo công việc',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật công việc gần nhất',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Chèn một số dữ liệu mẫu (Optional - để kiểm tra ban đầu)
INSERT INTO `todos` (`title`, `description`, `completed`, `priority`, `due_date`) VALUES
('Thiết lập dự án Spring Boot', 'Tạo cấu trúc thư mục, cấu hình Maven pom.xml và kết nối cơ sở dữ liệu MySQL.', true, 'HIGH', CURDATE()),
('Xây dựng giao diện React', 'Thiết kế giao diện Dark Mode & Glassmorphism với bộ lọc trạng thái và phân trang.', false, 'HIGH', DATE_ADD(CURDATE(), INTERVAL 1 DAY)),
('Viết Unit Test cho Service', 'Sử dụng JUnit 5 và Mockito để kiểm thử các nghiệp vụ CRUD của TodoService.', false, 'MEDIUM', DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
('Đóng gói ứng dụng bằng Docker', 'Tạo Dockerfile cho Frontend, Backend và cấu hình file docker-compose.yml.', false, 'LOW', DATE_ADD(CURDATE(), INTERVAL 3 DAY));
