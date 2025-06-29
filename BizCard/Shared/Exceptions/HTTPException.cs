namespace BizCard.Shared.Exceptions
{
    public class HTTPException : Exception
    {
        public int StatusCode { get; }
        public HTTPException(int statusCode, string message) : base(message) { StatusCode = statusCode; }
    }
}
