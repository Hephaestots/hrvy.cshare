using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PublicApi.Controllers
{
    [AllowAnonymous]
    public class FallbackController : Controller
    {
        public IActionResult Index()
        {
            return PhysicalFile(
                Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), 
                "text/HTML");
        }
    }
}
