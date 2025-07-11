using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Student_demo.DTOs;
using Student_demo.Interfaces;
using Student_demo.Models;
using Student_demo.Services;
using Student_demo.Shared;
using System.Security.Claims;

namespace Student_demo.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;
        private readonly ISubjectService _subjectService;
        private readonly IStudentSubjectService _studentSubjectService;

        public StudentController(
            IStudentService studentService,
            ISubjectService subjectService,
            IStudentSubjectService studentSubjectService)
        {
            _studentService = studentService;
            _subjectService = subjectService;
            _studentSubjectService = studentSubjectService;
        }

        /// ❌ Danh sách tất cả sinh viên - chỉ Admin được truy cập
        [HttpGet]
        [Authorize("Permission:student:view")]
        public async Task<IActionResult> GetAll()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (role == "Student")
                return Forbid("Sinh viên không được phép xem danh sách tất cả sinh viên.");

            var result = await _studentService.GetAllAsync();
            return Ok(ApiResponse<List<Student>>.SuccessResponse(result));
        }

        /// ✅ Xem thông tin sinh viên theo ID - chính mình hoặc Admin
        [HttpGet("{id}")]
        [Authorize("Permission:student:view")]
        public async Task<IActionResult> GetById(int id)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var isRoot = User.FindFirst("IsRoot")?.Value == "true";
            var studentIdFromToken = User.FindFirst("StudentId")?.Value;

            if (role == "Student" && !isRoot && studentIdFromToken != id.ToString())
                return Forbid("Bạn chỉ được phép xem thông tin của chính mình.");

            var student = await _studentService.GetDetailsAsync(id);
            if (student == null)
                return NotFound(ApiResponse<string>.Fail("Sinh viên không tồn tại"));

            return Ok(ApiResponse<Student>.SuccessResponse(student));
        }

        /// ✅ Tổng số môn học đang học - chính mình hoặc Admin
        [HttpGet("{id}/subjects/count")]
        [Authorize("Permission:student:view")]
        public async Task<IActionResult> GetSubjectCount(int id)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var isRoot = User.FindFirst("IsRoot")?.Value == "true";
            var studentIdFromToken = User.FindFirst("StudentId")?.Value;

            if (role == "Student" && !isRoot && studentIdFromToken != id.ToString())
                return Forbid("Bạn chỉ được phép xem thông tin của chính mình.");

            var count = await _studentService.GetSubjectCountAsync(id);
            return Ok(ApiResponse<int>.SuccessResponse(count));
        }

        /// ✅ Thêm sinh viên (Admin)
        [HttpPost("add")]
        [Authorize("Permission:student:add")]
        public async Task<IActionResult> AddStudent([FromBody] StudentDto dto)
        {
            var result = await _studentService.AddStudentAsync(dto);
            return Ok(ApiResponse<Student>.SuccessResponse(result, "Thêm sinh viên thành công"));
        }

        /// ✅ Xoá sinh viên (Admin)
        [HttpDelete("{id}")]
        [Authorize("Permission:student:delete")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _studentService.GetByIdAsync(id);
            if (student == null)
                return NotFound(ApiResponse<string>.Fail("Student not found"));

            await _studentService.DeleteAsync(id);
            return Ok(ApiResponse<string>.SuccessResponse("Student deleted successfully"));
        }

        /// ✅ Cập nhật sinh viên - chính mình hoặc Admin
        [HttpPut("update-profile/{id}")]
        [Authorize("Permission:student:edit")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] Student student)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var isRoot = User.FindFirst("IsRoot")?.Value == "true";
            var studentIdFromToken = User.FindFirst("StudentId")?.Value;

            if (role == "Student" && !isRoot && studentIdFromToken != id.ToString())
                return Forbid("Bạn chỉ được phép cập nhật thông tin của chính mình.");

            var result = await _studentService.UpdateProfileAsync(id, student);
            return result
                ? Ok(ApiResponse<string>.SuccessResponse("Cập nhật sinh viên thành công"))
                : NotFound(ApiResponse<string>.Fail("Không tìm thấy sinh viên"));
        }

        /// ✅ Xem tiến độ học tập - chính mình hoặc Admin
        [Authorize("Permission:student:view")]
        [HttpGet("{id}/progress")]
        public async Task<IActionResult> GetProgress(int id)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var isRoot = User.FindFirst("IsRoot")?.Value == "true";
            var studentIdFromToken = User.FindFirst("StudentId")?.Value;

            // Nếu là student mà không phải chính mình hoặc không phải root thì bị chặn
            if (role == "Student" && !isRoot && studentIdFromToken != id.ToString())
                return Forbid("Bạn chỉ được phép xem tiến độ học tập của chính mình.");

            var totalSubjects = await _subjectService.GetAllAsync(); // hoặc _subjectRepo.CountAsync()
            var scores = await _studentSubjectService.GetSubjectsByStudentAsync(id);

            var registered = scores.Count;
            var completed = scores.Count(s => s.ProcessPoint.HasValue || s.ComponentPoint.HasValue);
            var passed = scores.Count(s => s.IsPassed == true);
            var finalPoints = scores
                .Where(s => s.FinalPoint.HasValue)
                .Select(s => s.FinalPoint!.Value)
                .ToList();
            var gpa = finalPoints.Count > 0 ? finalPoints.Average() : 0;

            var result = new StudentProgressDto
            {
                TotalSubjects = totalSubjects.Count,
                RegisteredSubjects = registered,
                CompletedSubjects = completed,
                PassedSubjects = passed,
                GPA = (float)Math.Round(gpa, 2)
            };

            return Ok(ApiResponse<StudentProgressDto>.SuccessResponse(result));
        }

    }
}
