namespace Application.Core
{
    /// <summary>
    /// Return value for an API call.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class Result<T>
    {
        public string? Error { get; set; }
        public bool IsSuccess { get; set; }
        public T? Value { get; set; }

        /// <summary>
        /// Instanciate a new success result.
        /// </summary>
        /// <param name="value">Object being returned from the API.</param>
        /// <returns></returns>
        public static Result<T> Success(T value) => new() { IsSuccess= true, Value = value };

        /// <summary>
        /// Instanciate a new failure result.
        /// </summary>
        /// <param name="error">Error message.</param>
        /// <returns></returns>
        public static Result<T> Failure(string error) => new() { IsSuccess = false, Error = error };
    }
}
