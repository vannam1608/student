using Student_demo.Interfaces;
using Student_demo.Models;

public interface IStudentSubjectService : IBaseService<StudentSubject>
{
    /// Xem danh sách môn học đã đăng ký (kèm điểm nếu có) của 1 sinh viên
    Task<List<StudentSubject>> GetSubjectsByStudentAsync(int studentId);

    /// Nhập điểm cả quá trình và thành phần cho một sinh viên ở một môn học
    Task<bool> InputScoreAsync(int studentId, int subjectId, float process, float component);

    /// Cập nhật lại điểm (thường giống với InputScoreAsync, nhưng tách rõ logic là "chỉnh sửa")
    Task<bool> UpdateScoreAsync(int studentId, int subjectId, float process, float component);

    /// Lấy danh sách sinh viên đã đăng ký một môn học
    Task<List<Student>> GetStudentsBySubjectAsync(int subjectId);

    /// Lấy toàn bộ bảng điểm (của tất cả sinh viên, tất cả môn)
    Task<List<StudentSubject>> GetAllScoresAsync();

    Task<List<StudentSubject>> GetByStudentAsync(int studentId);


    /// Nhập riêng điểm quá trình
    Task<bool> InputProcessPointAsync(int studentId, int subjectId, float process);

    /// Nhập riêng điểm thành phần
    Task<bool> InputComponentPointAsync(int studentId, int subjectId, float component);
}
