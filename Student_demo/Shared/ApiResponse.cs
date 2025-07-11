namespace Student_demo.Shared
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T Data { get; set; }
        public string? Message { get; set; }

        // ✅ Constructor không tham số (giúp giữ tương thích cũ)
        public ApiResponse() { }

        // ✅ Constructor có data
        public ApiResponse(T data)
        {
            Success = true;
            Data = data;
        }

        public static ApiResponse<T> SuccessResponse(T data, string? message = null)
            => new() { Success = true, Data = data, Message = message };

        public static ApiResponse<T> Fail(string message)
            => new() { Success = false, Message = message };
    }
}
