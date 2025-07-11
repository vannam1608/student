using Microsoft.EntityFrameworkCore;
using Student_demo.Data;
using Student_demo.DTOs;
using Student_demo.Interfaces;
using Student_demo.Models;
using Student_demo.Shared;
using System;

namespace Student_demo.Services
{
    public class StudentService : BaseService<Student>, IStudentService
    {
        public StudentService(AppDbContext context) : base(context) { }

        public async Task<Student> AddStudentAsync(StudentDto dto)
        {
            var student = new Student
            {
                Code = dto.StudentCode,
                Name = dto.Name,
                Gender = dto.Gender,
                BirthDate = dto.BirthDate,
                Class = dto.Class,
                Course = dto.Course
            };

            await _dbSet.AddAsync(student);
            await _context.SaveChangesAsync();

            return student;
        }


        public async Task<Student?> GetDetailsAsync(int id) =>
            await _dbSet.Include(s => s.StudentSubjects).ThenInclude(ss => ss.Subject)
                        .FirstOrDefaultAsync(s => s.Id == id); // Xem chi tiết sinh viên

        public async Task<int> GetSubjectCountAsync(int studentId) =>
            await _context.StudentSubjects.CountAsync(ss => ss.StudentId == studentId); // Số môn học đã đăng ký

        public async Task<bool> UpdateProfileAsync(int id, Student updatedStudent)
        {
            var existingStudent = await _dbSet.FirstOrDefaultAsync(s => s.Id == id);
            if (existingStudent == null) return false;

            existingStudent.Code = updatedStudent.Code;
            existingStudent.Name = updatedStudent.Name;
            existingStudent.Gender = updatedStudent.Gender;
            existingStudent.BirthDate = updatedStudent.BirthDate;
            existingStudent.Class = updatedStudent.Class;
            existingStudent.Course = updatedStudent.Course;

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task UpdateStudentAsync(int id, Student updatedStudent)
        {
            var existingStudent = await _dbSet.FirstOrDefaultAsync(s => s.Id == id);
            if (existingStudent != null)
            {
                existingStudent.Code = updatedStudent.Code;
                existingStudent.Name = updatedStudent.Name;
                existingStudent.Gender = updatedStudent.Gender;
                existingStudent.BirthDate = updatedStudent.BirthDate;
                existingStudent.Class = updatedStudent.Class;
                existingStudent.Course = updatedStudent.Course;

                await _context.SaveChangesAsync(); // Chỉnh sửa thông tin sinh viên
            }
        }


    }

}
