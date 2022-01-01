using API.Controllers.Base;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace PublicApi.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> Details(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }
    }
}
