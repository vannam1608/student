    namespace Student_demo.Models
    {
        public class Student
        {
            public int Id { get; set; }
            public string Code { get; set; }           // Mã sinh viên
            public string Name { get; set; }           // Tên sinh viên
            public string Gender { get; set; }         // Giới tính (Nam/Nữ)
            public DateTime BirthDate { get; set; }    // Ngày sinh
            public string Class { get; set; }          // Lớp học
            public string Course { get; set; }         // Khoá học (VD: K17, K18,...)

            public List<StudentSubject> StudentSubjects { get; set; } = new(); // Danh sách môn học đã đăng ký
        }
    }
