using Microsoft.EntityFrameworkCore;
using Student_demo.Data;
using Student_demo.Interfaces;
using Student_demo.Models;
using Student_demo.Shared;
using System;

namespace Student_demo.Services
{
    public class StudentSubjectService : BaseService<StudentSubject>, IStudentSubjectService
    {
        public StudentSubjectService(AppDbContext context) : base(context) { }

        public async Task<List<Student>> GetStudentsBySubjectAsync(int subjectId)
        {
            return await _dbSet.Include(ss => ss.Student)
                               .Where(ss => ss.SubjectId == subjectId)
                               .Select(ss => ss.Student)
                               .ToListAsync();
        }

        public async Task<List<StudentSubject>> GetSubjectsByStudentAsync(int studentId)
        {
            return await _dbSet.Include(ss => ss.Subject)
                               .Where(ss => ss.StudentId == studentId)
                               .ToListAsync();
        }

        // ✅ Chỉ nhập điểm quá trình (process)
        public async Task<bool> InputProcessPointAsync(int studentId, int subjectId, float process)
        {
            var ss = await _dbSet.Include(x => x.Subject)
                                 .FirstOrDefaultAsync(x => x.StudentId == studentId && x.SubjectId == subjectId);

            if (ss == null) return false;

            if (ss.Subject.StartDate > DateTime.Now)
                throw new InvalidOperationException("Chưa đến ngày học, không thể nhập điểm quá trình.");

            ss.ProcessPoint = process;
            _context.Update(ss);
            await _context.SaveChangesAsync();

            return true;
        }

        // ✅ Chỉ nhập điểm thành phần (component)
        public async Task<bool> InputComponentPointAsync(int studentId, int subjectId, float component)
        {
            var ss = await _dbSet.Include(x => x.Subject)
                                 .FirstOrDefaultAsync(x => x.StudentId == studentId && x.SubjectId == subjectId);

            if (ss == null) return false;

            if (ss.Subject.ExamDate > DateTime.Now)
                throw new InvalidOperationException("Chưa đến ngày thi, không thể nhập điểm thành phần.");

            ss.ComponentPoint = component;
            _context.Update(ss);
            await _context.SaveChangesAsync();

            return true;
        }

        // ✅ Nhập cả 2 điểm (giữ lại nếu bạn vẫn muốn hỗ trợ)
        public async Task<bool> InputScoreAsync(int studentId, int subjectId, float process, float component)
        {
            var ss = await _dbSet.Include(x => x.Subject)
                                 .FirstOrDefaultAsync(x => x.StudentId == studentId && x.SubjectId == subjectId);

            if (ss == null) return false;

            if (ss.Subject.StartDate > DateTime.Now)
                throw new InvalidOperationException("Môn học chưa đến ngày bắt đầu, không được phép nhập điểm.");

            ss.ProcessPoint = process;
            ss.ComponentPoint = component;

            _context.Update(ss);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateScoreAsync(int studentId, int subjectId, float process, float component)
        {
            var ss = await _dbSet.Include(x => x.Subject)
                                 .FirstOrDefaultAsync(x => x.StudentId == studentId && x.SubjectId == subjectId);

            if (ss == null) return false;

            ss.ProcessPoint = process;
            ss.ComponentPoint = component;
            _context.Update(ss);
            await _context.SaveChangesAsync();

            return true;
        }

        // ✅ Trả về lịch học + điểm + kết quả nếu đủ điểm
        public async Task<List<object>> GetScheduleAndScoreByStudentAsync(int studentId)
        {
            return await _dbSet.Include(ss => ss.Subject)
                               .Where(ss => ss.StudentId == studentId)
                               .Select(ss => new
                               {
                                   SubjectName = ss.Subject.Name,
                                   StartDate = ss.Subject.StartDate,
                                   StudyTime = ss.Subject.StudyTime,
                                   ExamDate = ss.Subject.ExamDate,
                                   ExamTime = ss.Subject.ExamTime,
                                   ss.ProcessPoint,
                                   ss.ComponentPoint,
                                   FinalPoint = (ss.ProcessPoint != null || ss.ComponentPoint != null)
                                        ? (double?)Math.Round(
                                            (
                                                (ss.ProcessPoint ?? 0) * ss.Subject.ProcessWeight +
                                                (ss.ComponentPoint ?? 0) * ss.Subject.ComponentWeight
                                            ) / 100.0,
                                            2)
                                        : null,

                                  IsPassed = (ss.ProcessPoint != null || ss.ComponentPoint != null)
                                        ? (
                                            ((ss.ProcessPoint ?? 0) * ss.Subject.ProcessWeight +
                                             (ss.ComponentPoint ?? 0) * ss.Subject.ComponentWeight) / 100.0
                                          ) >= 4.0
                                        : (bool?)null

                               })
                               .Cast<object>()
                               .ToListAsync();
        }

        public async Task<List<StudentSubject>> GetAllScoresAsync()
        {
            return await _context.StudentSubjects
                .Include(ss => ss.Student)
                .Include(ss => ss.Subject)
                .ToListAsync();
        }

        public async Task<List<StudentSubject>> GetByStudentAsync(int studentId)
        {
            return await _context.StudentSubjects
                .Include(ss => ss.Subject) // Nếu cần thêm thông tin môn học
                .Where(ss => ss.StudentId == studentId)
                .ToListAsync();
        }

    }
}
