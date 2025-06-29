using BizCard.Shared.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BizCard.Shared.Filters
{
    public class ExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            if (context.Exception is HTTPException httpEx)
            {
                context.Result = new ObjectResult(httpEx.Message)
                {
                    StatusCode = httpEx.StatusCode
                };
                context.ExceptionHandled = true;
            }
            else
            {
                // Generic error fallback
                context.Result = new ObjectResult(new { error = context.Exception.Message })
                {
                    StatusCode = 500
                };
                context.ExceptionHandled = true;
            }
        }
    }
}
