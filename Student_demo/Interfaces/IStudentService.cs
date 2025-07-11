using Student_demo.DTOs;
using Student_demo.Models;

namespace Student_demo.Interfaces
{
    public interface IStudentService : IBaseService<Student>
    {
        Task<Student> AddStudentAsync(StudentDto dto);
        Task<Student?> GetDetailsAsync(int id); // Xem chi tiết sinh viên
        Task<int> GetSubjectCountAsync(int studentId); // Xem số môn học sinh viên đăng ký
        Task<bool> UpdateProfileAsync(int id, Student student);


        Task UpdateStudentAsync(int id, Student student); // Chỉnh sửa thông tin sinh viên
      
    }
}
