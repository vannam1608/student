// DTOs/SubjectDto.cs
public class SubjectDto
{
    public int Id { get; set; }
    public string Name { get; set; }

    public int Credit { get; set; }                  // ✅ Thêm dòng này
    public int SessionCount { get; set; }
    public double ProcessWeight { get; set; }
    public double ComponentWeight { get; set; }

    public DateTime StartDate { get; set; }
    public string StudyTime { get; set; }
    public DateTime ExamDate { get; set; }
    public string ExamTime { get; set; }
}
