-- XÓA DB CŨ (nếu có)
DROP DATABASE IF EXISTS StudentDemoDB;
GO

-- TẠO DB MỚI
CREATE DATABASE StudentDemoDB;
GO

USE StudentDemoDB;
GO

-- Students
CREATE TABLE Students (
    Id INT IDENTITY PRIMARY KEY,
    Code NVARCHAR(20) NOT NULL UNIQUE,
    Name NVARCHAR(100) NOT NULL,
    Gender NVARCHAR(10) NOT NULL,
    BirthDate DATE NOT NULL,
    Class NVARCHAR(20) NOT NULL,
    Course NVARCHAR(20) NOT NULL
);

-- Users
CREATE TABLE Users (
    Id INT IDENTITY PRIMARY KEY,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(100) NOT NULL,
    Role NVARCHAR(50) NOT NULL,
    StudentId INT NULL FOREIGN KEY REFERENCES Students(Id) ON DELETE SET NULL,
    IsRoot BIT DEFAULT 0
);

-- Subjects
CREATE TABLE Subjects (
    Id INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Credit INT NOT NULL,
    SessionCount INT NOT NULL,
    ProcessWeight FLOAT NOT NULL,
    ComponentWeight FLOAT NOT NULL,
    StartDate DATE,
    StudyTime NVARCHAR(20),
    ExamDate DATE,
    ExamTime NVARCHAR(20)
);

-- StudentSubjects
CREATE TABLE StudentSubjects (
    StudentId INT NOT NULL,
    SubjectId INT NOT NULL,
    ProcessPoint FLOAT DEFAULT NULL,
    ComponentPoint FLOAT DEFAULT NULL,
    PRIMARY KEY (StudentId, SubjectId),
    FOREIGN KEY (StudentId) REFERENCES Students(Id) ON DELETE CASCADE,
    FOREIGN KEY (SubjectId) REFERENCES Subjects(Id) ON DELETE CASCADE
);

-- ✅ Students
INSERT INTO Students (Code, Name, Gender, BirthDate, Class, Course) VALUES
('SV001', N'Nguyễn Văn A', N'Nam', '2002-04-10', 'CTK43', 'K43'),
('SV002', N'Trần Thị B', N'Nữ', '2001-11-22', 'CTK43', 'K43'),
('SV003', N'Lê Văn C', N'Nam', '2002-07-15', 'CTK44', 'K44'),
('SV004', N'Phạm Thị D', N'Nữ', '2003-01-05', 'CTK44', 'K44'),
('SV005', N'Hoàng Văn E', N'Nam', '2001-09-09', 'CTK42', 'K42'),
('SV006', N'Ngô Thị F', N'Nữ', '2002-02-12', 'CTK43', 'K43'),
('SV007', N'Vũ Văn G', N'Nam', '2001-08-19', 'CTK42', 'K42'),
('SV008', N'Lý Thị H', N'Nữ', '2003-03-25', 'CTK44', 'K44');

-- ✅ Users
INSERT INTO Users (Email, Password, Role, StudentId, IsRoot) VALUES
('admin1@email.com', 'admin123', 'Admin', NULL, 0),
('superadmin@email.com', 'super123', 'Admin', NULL, 1),
('student1@email.com', 'student123', 'Student', 1, 0),
('student2@email.com', 'student123', 'Student', 2, 0),
('student3@email.com', 'student123', 'Student', 3, 0),
('student4@email.com', 'student123', 'Student', 4, 0),
('student5@email.com', 'student123', 'Student', 5, 0),
('student6@email.com', 'student123', 'Student', 6, 0);

-- ✅ Subjects (gồm 3 môn mới ở cuối)
INSERT INTO Subjects (Name, Credit, SessionCount, ProcessWeight, ComponentWeight, StartDate, StudyTime, ExamDate, ExamTime) VALUES
(N'Toán cao cấp', 3, 30, 40, 60, '2025-03-01', '08:00 - 10:00', '2025-06-15', '13:30 - 15:30'),
(N'Cơ sở dữ liệu', 3, 35, 50, 50, '2025-03-10', '10:00 - 12:00', '2025-06-20', '08:00 - 10:00'),
(N'Lập trình C#', 4, 40, 30, 70, '2025-09-05', '13:30 - 15:30', '2025-12-20', '09:00 - 11:00'),
(N'Khoa học dữ liệu', 3, 32, 45, 55, '2025-09-02', '15:30 - 17:30', '2025-12-18', '13:30 - 15:30'),
(N'Trí tuệ nhân tạo', 4, 36, 40, 60, '2025-09-04', '07:00 - 09:00', '2025-12-22', '07:00 - 09:00'),
(N'Kỹ thuật lập trình', 3, 30, 50, 50, '2025-03-05', '08:00 - 10:00', '2025-06-25', '10:00 - 12:00'),
(N'Nhập môn mạng máy tính', 3, 28, 40, 60, '2025-03-08', '13:30 - 15:30', '2025-06-27', '15:30 - 17:30'),
(N'Hệ điều hành', 4, 35, 45, 55, '2025-09-10', '10:00 - 12:00', '2025-12-23', '08:00 - 10:00'),
(N'Lập trình Web', 3, 32, 30, 70, '2025-09-12', '07:00 - 09:00', '2025-12-26', '09:00 - 11:00'),
(N'Thiết kế giao diện', 2, 20, 50, 50, '2025-03-15', '09:00 - 11:00', '2025-06-28', '13:30 - 15:30'),
(N'Phân tích hệ thống', 3, 34, 60, 40, '2025-03-12', '15:30 - 17:30', '2025-06-30', '15:30 - 17:30'),
(N'Lập trình Java', 4, 36, 40, 60, '2025-09-07', '13:30 - 15:30', '2025-12-25', '10:00 - 12:00'),
(N'An toàn thông tin', 3, 30, 45, 55, '2025-09-09', '08:00 - 10:00', '2025-12-28', '13:30 - 15:30'),
(N'Phát triển phần mềm', 3, 30, 50, 50, '2025-09-11', '10:00 - 12:00', '2025-12-30', '10:00 - 12:00'),
(N'Mạng máy tính nâng cao', 3, 28, 50, 50, '2025-09-13', '15:30 - 17:30', '2025-12-31', '15:30 - 17:30'),

-- ✅ 3 môn mới (tháng 7/2025)
(N'Phát triển ứng dụng di động', 3, 30, 50, 50, '2025-03-15', '08:00 - 10:00', '2025-07-25', '08:00 - 10:00'),
(N'Quản trị hệ thống', 3, 30, 50, 50, '2025-04-25', '10:00 - 12:00', '2025-07-26', '10:00 - 12:00'),
(N'Lập trình Python', 3, 30, 50, 50, '2025-04-30', '13:30 - 15:30', '2025-07-30', '13:30 - 15:30');

-- ✅ StudentSubjects (có điểm nếu môn < 08/2025)
INSERT INTO StudentSubjects (StudentId, SubjectId, ProcessPoint, ComponentPoint) VALUES
-- Môn đã học (có điểm)
(1, 1, 7.5, 8.0),
(1, 2, 6.5, 7.0),
(2, 1, 5.0, 6.0),
(2, 2, 6.0, 5.5),
(3, 1, 7.5, 8.5),
(4, 2, 6.5, 7.0),
(5, 1, 8.0, 8.5),
(6, 6, 7.0, 8.0),
(7, 7, 6.5, 6.0),
(8, 10, 7.8, 8.2),
(3, 11, 6.9, 7.5),

-- ✅ 3 môn mới chỉ có 1 loại điểm
(1, 16, 7.5, NULL),  -- chỉ điểm quá trình
(2, 17, NULL, 8.0),  -- chỉ điểm thành phần
(3, 18, 6.5, NULL),  -- chỉ điểm quá trình

-- Môn chưa học (StartDate >= 2025-08) — không có điểm
(1, 3, NULL, NULL),
(2, 4, NULL, NULL),
(3, 5, NULL, NULL),
(4, 8, NULL, NULL),
(5, 9, NULL, NULL),
(6, 12, NULL, NULL),
(7, 13, NULL, NULL),
(8, 14, NULL, NULL),
(5, 15, NULL, NULL);
