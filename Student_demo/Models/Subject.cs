// Models/Subject.cs
using Student_demo.Models;

public class Subject
{
    public int Id { get; set; }
    public string Name { get; set; }

    public int Credit { get; set; }                  // ✅ Thêm dòng này
    public int SessionCount { get; set; }
    public double ProcessWeight { get; set; }
    public double ComponentWeight { get; set; }

    public DateTime? StartDate { get; set; }
    public string? StudyTime { get; set; }
    public DateTime? ExamDate { get; set; }
    public string? ExamTime { get; set; }

    public List<StudentSubject> StudentSubjects { get; set; } = new();
}
