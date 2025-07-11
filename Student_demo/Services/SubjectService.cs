using Microsoft.EntityFrameworkCore;
using Student_demo.Data;
using Student_demo.DTOs;
using Student_demo.Interfaces;
using Student_demo.Models;
using Student_demo.Shared;

namespace Student_demo.Services
{
    public class SubjectService : BaseService<Subject>, ISubjectService
    {
        public SubjectService(AppDbContext context) : base(context) { }

        // Xoá môn học và tất cả đăng ký liên quan
        public async Task<bool> DeleteAndReindexAsync(int id)
        {
            var subjectToDelete = await _dbSet.FindAsync(id);
            if (subjectToDelete == null) return false;

            // Xoá các đăng ký môn học liên quan
            var studentSubjects = await _context.StudentSubjects
                                                .Where(ss => ss.SubjectId == id)
                                                .ToListAsync();

            _context.StudentSubjects.RemoveRange(studentSubjects);
            _dbSet.Remove(subjectToDelete);

            await _context.SaveChangesAsync();
            return true;
        }

        // Chỉnh sửa môn học
        public async Task UpdateSubjectAsync(int id, Subject updatedSubject)
        {
            var subject = await GetByIdAsync(id);
            if (subject == null) return;

            subject.Name = updatedSubject.Name;
            subject.Credit = updatedSubject.Credit; // ✅ THÊM DÒNG NÀY 
            subject.SessionCount = updatedSubject.SessionCount;
            subject.ProcessWeight = updatedSubject.ProcessWeight;
            subject.ComponentWeight = updatedSubject.ComponentWeight;
            subject.StartDate = updatedSubject.StartDate;
            subject.StudyTime = updatedSubject.StudyTime;
            subject.ExamDate = updatedSubject.ExamDate;
            subject.ExamTime = updatedSubject.ExamTime;

            await _context.SaveChangesAsync();
        }


        // Lấy danh sách sinh viên theo môn học
        public async Task<List<Student>> GetStudentsBySubjectAsync(int subjectId)
        {
            return await _context.StudentSubjects
                                 .Where(ss => ss.SubjectId == subjectId)
                                 .Include(ss => ss.Student)
                                 .Select(ss => ss.Student)
                                 .ToListAsync();
        }

        // Đăng ký môn học
        public async Task<bool> RegisterSubjectAsync(int studentId, int subjectId)
        {
            var already = await _context.StudentSubjects
                .AnyAsync(x => x.StudentId == studentId && x.SubjectId == subjectId);

            if (already) return false;

            var subject = await _context.Subjects.FindAsync(subjectId);
            if (subject == null) return false;

            var studentSubject = new StudentSubject
            {
                StudentId = studentId,
                SubjectId = subjectId,
                ProcessPoint = null,  // ✅ Không nhập điểm
                ComponentPoint = null
            };

            _context.StudentSubjects.Add(studentSubject);
            await _context.SaveChangesAsync();
            return true;
        }


        // Hủy đăng ký môn học
        public async Task<bool> UnregisterSubjectAsync(int studentId, int subjectId)
        {
            var studentSubject = await _context.StudentSubjects
                                               .FirstOrDefaultAsync(x => x.StudentId == studentId && x.SubjectId == subjectId);

            if (studentSubject == null) return false;

            _context.StudentSubjects.Remove(studentSubject);
            await _context.SaveChangesAsync();
            return true;
        }

        // 🔄 Trả về cả lịch học + lịch thi + điểm số nếu có
        public async Task<List<SubjectScheduleDto>> GetScheduleByStudentAsync(int studentId)
        {
            return await _context.StudentSubjects
                .Include(ss => ss.Subject)
                .Where(ss => ss.StudentId == studentId)
                .Select(ss => new SubjectScheduleDto
                {
                    SubjectId = ss.Subject.Id, // ⚠️ Đảm bảo bạn có thuộc tính này trong DTO
                    SubjectName = ss.Subject.Name,
                    StartDate = ss.Subject.StartDate,
                    StudyTime = ss.Subject.StudyTime,
                    ExamDate = ss.Subject.ExamDate,
                    ExamTime = ss.Subject.ExamTime,
                    ProcessPoint = ss.ProcessPoint,
                    ComponentPoint = ss.ComponentPoint,
                    FinalPoint = (ss.ProcessPoint != null && ss.ComponentPoint != null)
                        ? (double?)Math.Round(
                            (double)((ss.ProcessPoint.Value * ss.Subject.ProcessWeight + ss.ComponentPoint.Value * ss.Subject.ComponentWeight) / 100.0),
                            2)
                        : null,
                    IsPassed = (ss.ProcessPoint != null && ss.ComponentPoint != null)
                        ? ((ss.ProcessPoint.Value * ss.Subject.ProcessWeight + ss.ComponentPoint.Value * ss.Subject.ComponentWeight) / 100.0) >= 4.0
                        : (bool?)null
                })
                .ToListAsync();
        }


        public async Task<List<StudentSubject>> GetSubjectsWithScoreByStudentAsync(int studentId)
        {
            return await _context.StudentSubjects
                .Include(ss => ss.Subject)
                .Where(ss => ss.StudentId == studentId)
                .ToListAsync();
        }
    }
}
