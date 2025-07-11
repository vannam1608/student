public class SubjectScheduleDto
{
    public int SubjectId { get; set; } // ✅ Thêm để hỗ trợ phía frontend (Angular)

    public string SubjectName { get; set; }
    public DateTime? StartDate { get; set; }
    public string? StudyTime { get; set; }
    public DateTime? ExamDate { get; set; }
    public string? ExamTime { get; set; }

    // ✅ Điểm số (nullable nếu chưa có)
    public double? ProcessPoint { get; set; }
    public double? ComponentPoint { get; set; }
    public double? FinalPoint { get; set; }
    public bool? IsPassed { get; set; }
}
