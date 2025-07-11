namespace Student_demo.Interfaces
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IBaseService<T> where T : class
    {
        Task<List<T>> GetAllAsync();           // Lấy tất cả bản ghi
        Task<T?> GetByIdAsync(int id);         // Lấy bản ghi theo ID
        Task AddAsync(T entity);               // Thêm mới
        Task UpdateAsync(T entity);            // Cập nhật
        Task DeleteAsync(int id);              // Xoá theo ID

    }

}
