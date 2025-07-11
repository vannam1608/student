namespace Student_demo.Interfaces
{
    public interface IAuthService
    {
        Task<string?> LoginAsync(string email, string password);
    }
}
