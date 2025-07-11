using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Student_demo.DTOs;
using Student_demo.Interfaces;
using Student_demo.Models;
using Student_demo.Shared;
using System.Security.Claims;

namespace Student_demo.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SubjectController : ControllerBase
    {
        private readonly ISubjectService _subjectService;

        public SubjectController(ISubjectService subjectService)
        {
            _subjectService = subjectService;
        }

        // 🔐 Xem tất cả môn học
        [HttpGet]
        [Authorize("Permission:subject:view")]
        public async Task<IActionResult> GetAll()
        {
            var subjects = await _subjectService.GetAllAsync();
            return Ok(ApiResponse<List<Subject>>.SuccessResponse(subjects));
        }

        // 🔐 Xem chi tiết môn học
        [HttpGet("{id}")]
        [Authorize("Permission:subject:view")]
        public async Task<IActionResult> GetById(int id)
        {
            var subject = await _subjectService.GetByIdAsync(id);
            return subject == null
                ? NotFound(ApiResponse<string>.Fail("Không tìm thấy môn học"))
                : Ok(ApiResponse<Subject>.SuccessResponse(subject));
        }

        // 🔐 Thêm môn học
        [HttpPost("add")]
        [Authorize("Permission:subject:add")]
        public async Task<IActionResult> CreateSubject([FromBody] SubjectDto dto)
        {
            var subject = new Subject
            {
                Name = dto.Name,
                Credit = dto.Credit,
                SessionCount = dto.SessionCount,
                ProcessWeight = dto.ProcessWeight,
                ComponentWeight = dto.ComponentWeight,
                StartDate = dto.StartDate,
                StudyTime = dto.StudyTime,
                ExamDate = dto.ExamDate,
                ExamTime = dto.ExamTime
            };

            await _subjectService.AddAsync(subject);
            return Ok(ApiResponse<string>.SuccessResponse("Thêm môn học thành công."));
        }

        // 🔐 Xoá môn học
        [HttpDelete("{id}")]
        [Authorize("Permission:subject:delete")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _subjectService.DeleteAndReindexAsync(id);
            return ok
                ? Ok(ApiResponse<string>.SuccessResponse("Xoá thành công"))
                : NotFound(ApiResponse<string>.Fail("Không tìm thấy môn học"));
        }

        // 🔐 Lấy danh sách sinh viên học môn
        [HttpGet("{subjectId}/students")]
        [Authorize("Permission:subject:view")]
        public async Task<IActionResult> GetStudentsBySubject(int subjectId)
        {
            var students = await _subjectService.GetStudentsBySubjectAsync(subjectId);
            return Ok(ApiResponse<object>.SuccessResponse(students, "Danh sách sinh viên học môn"));
        }


        // 🔐 Đăng ký môn học (chỉ cho phép sinh viên đăng ký chính mình)
        [HttpPost("register")]
        [Authorize("Permission:subject:register")]
        public async Task<IActionResult> RegisterSubject([FromBody] RegisterSubjectDto dto)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var isRoot = User.FindFirst("IsRoot")?.Value == "true";
            var studentIdFromToken = User.FindFirst("StudentId")?.Value;

            if (!isRoot && role == "Student")
            {
                if (studentIdFromToken == null || studentIdFromToken != dto.StudentId.ToString())
                {
                    return Forbid("Sinh viên chỉ được phép đăng ký môn học cho chính mình.");
                }
            }

            var result = await _subjectService.RegisterSubjectAsync(dto.StudentId, dto.SubjectId);

            if (!result)
            {
                return BadRequest(ApiResponse<string>.Fail("Sinh viên đã đăng ký môn học này hoặc thông tin không hợp lệ."));
            }

            return Ok(ApiResponse<string>.SuccessResponse("Đăng ký môn học thành công."));
        }



        // ❌ Hủy đăng ký môn học (Chặn sinh viên không được hủy)
        [HttpDelete("{subjectId}/unregister/{studentId}")]
        [Authorize("Permission:subject:unregister")]
        public async Task<IActionResult> UnregisterSubject(int subjectId, int studentId)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (role == "Student")
            {
                return Forbid("Sinh viên không được phép huỷ đăng ký môn học.");
            }

            var result = await _subjectService.UnregisterSubjectAsync(studentId, subjectId);
            return result
                ? Ok(ApiResponse<string>.SuccessResponse("Huỷ đăng ký môn học thành công"))
                : NotFound(ApiResponse<string>.Fail("Không tìm thấy đăng ký để huỷ"));
        }

        // 🔐 Lịch học + điểm số của sinh viên
        [HttpGet("schedule-and-score/{studentId}")]
        [Authorize("Permission:schedule:view")]
        public async Task<IActionResult> GetScheduleAndScore(int studentId)
        {
            var isRoot = User.FindFirst("IsRoot")?.Value == "true";
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var studentIdFromToken = User.FindFirst("StudentId")?.Value;

            if (!isRoot && role == "Student" && studentIdFromToken != studentId.ToString())
            {
                return Forbid("Bạn không được xem thông tin của sinh viên khác.");
            }

            var subjects = await _subjectService.GetSubjectsWithScoreByStudentAsync(studentId);
            var result = subjects.Select(ss => new
            {
                SubjectId = ss.SubjectId,
                ss.Subject.Name,
                ss.Subject.Credit,
                ss.Subject.StartDate,
                ss.Subject.StudyTime,
                ss.Subject.ExamDate,
                ss.Subject.ExamTime,
                ss.ProcessPoint,
                ss.ComponentPoint,
                FinalPoint = (ss.ProcessPoint != null && ss.ComponentPoint != null)
                    ? (double?)Math.Round(
                        (ss.ProcessPoint.Value * ss.Subject.ProcessWeight + ss.ComponentPoint.Value * ss.Subject.ComponentWeight) / 100.0,
                        2)
                    : null,
                IsPassed = (ss.ProcessPoint != null && ss.ComponentPoint != null)
                    ? ((ss.ProcessPoint.Value * ss.Subject.ProcessWeight + ss.ComponentPoint.Value * ss.Subject.ComponentWeight) / 100.0) >= 4.0
                    : (bool?)null
            });

            return Ok(ApiResponse<object>.SuccessResponse(result));
        }

        // 🔐 Cập nhật môn học
        [HttpPut("update/{id}")]
        [Authorize("Permission:subject:edit")]
        public async Task<IActionResult> UpdateSubject(int id, [FromBody] SubjectDto dto)
        {
            var existingSubject = await _subjectService.GetByIdAsync(id);
            if (existingSubject == null)
                return NotFound(ApiResponse<string>.Fail("Không tìm thấy môn học"));

            var updatedSubject = new Subject
            {
                Id = id,
                Name = dto.Name,
                Credit = dto.Credit,
                SessionCount = dto.SessionCount,
                ProcessWeight = dto.ProcessWeight,
                ComponentWeight = dto.ComponentWeight,
                StartDate = dto.StartDate,
                StudyTime = dto.StudyTime,
                ExamDate = dto.ExamDate,
                ExamTime = dto.ExamTime
            };

            await _subjectService.UpdateSubjectAsync(id, updatedSubject);
            return Ok(ApiResponse<string>.SuccessResponse("Cập nhật môn học thành công"));
        }
    }
}
