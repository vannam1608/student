using Student_demo.Models;

public class User
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Role { get; set; } = null!;

    public int? StudentId { get; set; } // ⚠️ khóa ngoại (nullable)
    public Student? Student { get; set; }

    public bool IsRoot { get; set; } // ✅ THÊM dòng này để ánh xạ với cột IsRoot trong bảng Users
}
