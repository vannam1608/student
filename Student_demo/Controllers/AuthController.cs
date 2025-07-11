using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Student_demo.DTOs;
using Student_demo.Interfaces;
using System.Security.Claims;

namespace Student_demo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Đăng nhập và nhận JWT token
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var token = await _authService.LoginAsync(dto.Email, dto.Password);

            if (token == null)
                return Unauthorized("Sai thông tin đăng nhập");

            if (token == "Unauthorized")
                return Unauthorized("Chỉ Admin được phép đăng nhập");

            return Ok(new { token });
        }

        /// <summary>
        /// Lấy thông tin người dùng hiện tại từ token
        /// </summary>
        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var email = User.Identity?.Name;
            var isRoot = User.FindFirst("IsRoot")?.Value;
            var permissions = User.FindAll("Permission").Select(p => p.Value).ToList();

            return Ok(new
            {
                email,
                isRoot = isRoot == "true",
                permissions
            });
        }
    }
}
