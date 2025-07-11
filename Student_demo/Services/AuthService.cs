using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Student_demo.Data;
using Student_demo.Interfaces;
using Student_demo.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Student_demo.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<string?> LoginAsync(string email, string password)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email && u.Password == password);

            if (user == null)
                return null;

            return GenerateJwtToken(user);
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.Email),
        new Claim(ClaimTypes.Role, user.Role),
        new Claim("IsRoot", user.IsRoot.ToString().ToLower())
    };

            // ✅ Thêm StudentId nếu là sinh viên
            if (user.Role == "Student" && user.StudentId.HasValue)
            {
                claims.Add(new Claim("StudentId", user.StudentId.Value.ToString()));
            }

            // ✅ Nếu không phải Super Admin, gán quyền cụ thể
            if (!user.IsRoot)
            {
                var permissions = new List<string>();

                if (user.Role == "Student")
                {
                    permissions = new List<string>
                    {
                        "student:view",
                        "student:edit",
                        "subject:view",
                        "subject:register",
                        "subject:unregister",
                        "score:view",
                        "schedule:view"
                    };
                }
                else if (user.Email == "admin1@email.com")
                {
                    permissions = new List<string>
            {
                "student:view",
                "student:add",
                "student:delete",
                "student:edit",
                "subject:view",
                "subject:add",
                "subject:edit",
                "subject:delete",
                "score:view",
                "score:edit"
            };
                }

                claims.AddRange(permissions.Select(p => new Claim("Permission", p)));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }        
    }
}
