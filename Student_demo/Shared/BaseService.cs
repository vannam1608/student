using System.Collections.Generic;
using System;
using Student_demo.Data;
using Microsoft.EntityFrameworkCore;

namespace Student_demo.Shared
{
    public class BaseService<T> : Interfaces.IBaseService<T> where T : class
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public BaseService(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<List<T>> GetAllAsync() => await _dbSet.ToListAsync(); // Lấy toàn bộ danh sách
        public async Task<T?> GetByIdAsync(int id) => await _dbSet.FindAsync(id); // Lấy theo ID
        public async Task AddAsync(T entity) { _dbSet.Add(entity); await _context.SaveChangesAsync(); } // Thêm mới
        public async Task UpdateAsync(T entity) { _dbSet.Update(entity); await _context.SaveChangesAsync(); } // Cập nhật
        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null) { _dbSet.Remove(entity); await _context.SaveChangesAsync(); } // Xoá theo ID
        }
    }
}
