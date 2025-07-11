using Microsoft.EntityFrameworkCore;
using Student_demo.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Student_demo.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Student> Students => Set<Student>();
        public DbSet<Subject> Subjects => Set<Subject>();
        public DbSet<StudentSubject> StudentSubjects => Set<StudentSubject>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<StudentSubject>().HasKey(ss => new { ss.StudentId, ss.SubjectId });
            modelBuilder.Entity<StudentSubject>()
                .HasOne(ss => ss.Student).WithMany(s => s.StudentSubjects).HasForeignKey(ss => ss.StudentId);
            modelBuilder.Entity<StudentSubject>()
                .HasOne(ss => ss.Subject).WithMany(s => s.StudentSubjects).HasForeignKey(ss => ss.SubjectId);
        }
        public DbSet<User> Users { get; set; }
    }
}
