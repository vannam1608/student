using Microsoft.EntityFrameworkCore;
using Student_demo.DTOs;
using Student_demo.Models;

namespace Student_demo.Interfaces
{
    public interface ISubjectService : IBaseService<Subject>
    {
        Task UpdateSubjectAsync(int id, Subject subject); // Chỉnh sửa thông tin môn học
        Task<bool> DeleteAndReindexAsync(int id);
        Task<List<Student>> GetStudentsBySubjectAsync(int subjectId);
        Task<bool> RegisterSubjectAsync(int studentId, int subjectId);
        Task<bool> UnregisterSubjectAsync(int studentId, int subjectId);
        Task<List<SubjectScheduleDto>> GetScheduleByStudentAsync(int studentId);
        Task<List<StudentSubject>> GetSubjectsWithScoreByStudentAsync(int studentId);

        // ❌ XÓA dòng này vì đã có trong IBaseService
        // Task UpdateAsync(Subject subject);
    }
}
