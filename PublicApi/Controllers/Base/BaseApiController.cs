//TODO: remove.
#nullable disable

using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using PublicApi.Extensions;

namespace API.Controllers.Base
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??= 
            HttpContext.RequestServices.GetService<IMediator>();

        /// <summary>
        /// Handling the Result<T> entity returned from the Application layer.
        /// </summary>
        /// <typeparam name="T">Result type value.</typeparam>
        /// <param name="result"></param>
        /// <returns></returns>
        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result == null) return NotFound();
            if (result.IsSuccess && result.Value != null) return Ok(result.Value);
            if (result.IsSuccess && result.Value == null) return NotFound();
            return BadRequest(result.Error);
        }

        protected ActionResult HandlePagedResult<T>(Result<PagedList<T>> result)
        {
            if (result == null) return NotFound();
            if (result.IsSuccess && result.Value != null)
            {
                Response.AddPaginationHeader(result.Value.CurrentPage, 
                    result.Value.PageSize, 
                    result.Value.TotalCount, 
                    result.Value.TotalPages);
                return Ok(result.Value);
            }
            if (result.IsSuccess && result.Value == null) return NotFound();
            return BadRequest(result.Error);
        }
    }
}