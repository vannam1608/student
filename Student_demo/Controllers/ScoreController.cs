using Microsoft.AspNetCore.Mvc;
using Student_demo.DTOs;
using Student_demo.Interfaces;
using Student_demo.Shared;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Student_demo.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ScoreController : ControllerBase
    {
        private readonly IStudentSubjectService _studentSubjectService;

        public ScoreController(IStudentSubjectService studentSubjectService)
        {
            _studentSubjectService = studentSubjectService;
        }

        [HttpGet("all")]
        [Authorize("Permission:score:view")]
        public async Task<IActionResult> GetAllScores()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (role == "Student")
                return Forbid("Sinh viên không được phép xem toàn bộ điểm.");

            var scores = await _studentSubjectService.GetAllScoresAsync();

            var result = scores.Select(ss => new
            {
                StudentId = ss.Student.Id,
                StudentName = ss.Student.Name,
                SubjectId = ss.Subject.Id,
                SubjectName = ss.Subject.Name,
                ss.ProcessPoint,
                ss.ComponentPoint,
                ss.FinalPoint,
                ss.IsPassed
            });

            return Ok(ApiResponse<object>.SuccessResponse(result.ToList()));
        }

        [HttpGet("student/{studentId}")]
        [Authorize("Permission:score:view")]
        public async Task<IActionResult> GetStudentScores(int studentId)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var isRoot = User.FindFirst("IsRoot")?.Value == "true";
            var studentIdFromToken = User.FindFirst("StudentId")?.Value;

            if (!isRoot && role == "Student" && studentIdFromToken != studentId.ToString())
                return Forbid("Bạn không được phép xem điểm của sinh viên khác.");

            var scores = await _studentSubjectService.GetSubjectsByStudentAsync(studentId);

            var result = scores.Select(ss => new
            {
                SubjectName = ss.Subject.Name,
                ss.ProcessPoint,
                ss.ComponentPoint,
                FinalPoint = ss.FinalPoint,
                IsPassed = ss.IsPassed
            });

            return Ok(ApiResponse<object>.SuccessResponse(result.ToList()));
        }

        /// <summary>
        /// 🔐 Nhập điểm cho sinh viên (đầy đủ: cả quá trình và thành phần)
        /// </summary>
        [HttpPost("input")]
        [Authorize("Permission:score:edit")]
        public async Task<IActionResult> InputScore(InputScoreDto dto)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (role == "Student")
                return Forbid("Sinh viên không được phép nhập điểm.");

            var success = await _studentSubjectService.InputScoreAsync(
                dto.StudentId,
                dto.SubjectId,
                dto.ProcessScore,
                dto.ComponentScore
            );

            return success
                ? Ok(ApiResponse<string>.SuccessResponse("Nhập điểm thành công"))
                : BadRequest(ApiResponse<string>.Fail("Không thể nhập điểm cho sinh viên này"));
        }

        /// <summary>
        /// 🔐 Nhập điểm quá trình (chỉ nhập điểm quá trình)
        /// </summary>
        [HttpPost("input-process")]
        [Authorize("Permission:score:edit")]
        public async Task<IActionResult> InputProcessPoint([FromBody] InputPartialScoreDto dto)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (role == "Student")
                return Forbid("Sinh viên không được phép nhập điểm.");

            var success = await _studentSubjectService.InputProcessPointAsync(dto.StudentId, dto.SubjectId, dto.Score);
            return success
                ? Ok(ApiResponse<string>.SuccessResponse("Nhập điểm quá trình thành công"))
                : BadRequest(ApiResponse<string>.Fail("Không thể nhập điểm quá trình"));
        }

        /// <summary>
        /// 🔐 Nhập điểm thành phần (chỉ nhập điểm cuối kỳ)
        /// </summary>
        [HttpPost("input-component")]
        [Authorize("Permission:score:edit")]
        public async Task<IActionResult> InputComponentPoint([FromBody] InputPartialScoreDto dto)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (role == "Student")
                return Forbid("Sinh viên không được phép nhập điểm.");

            var success = await _studentSubjectService.InputComponentPointAsync(dto.StudentId, dto.SubjectId, dto.Score);
            return success
                ? Ok(ApiResponse<string>.SuccessResponse("Nhập điểm thành phần thành công"))
                : BadRequest(ApiResponse<string>.Fail("Không thể nhập điểm thành phần"));
        }
    }
}
