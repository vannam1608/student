namespace Student_demo.Models
{
    public class StudentSubject
    {
        public int StudentId { get; set; }
        public Student Student { get; set; }

        public int SubjectId { get; set; }
        public Subject Subject { get; set; }

        public double? ProcessPoint { get; set; }       // ✅ Cho phép null
        public double? ComponentPoint { get; set; }     // ✅ Cho phép null

        public double? FinalPoint =>
            (ProcessPoint.HasValue && ComponentPoint.HasValue)
                ? (double?)((ProcessPoint.Value * Subject.ProcessWeight + ComponentPoint.Value * Subject.ComponentWeight) / 100.0)
                : null;

        public bool? IsPassed =>
            FinalPoint.HasValue ? FinalPoint.Value >= 4.0 : null;
    }
}
