using Ardalis.GuardClauses;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PublicApi.DTOs;
using PublicApi.Interfaces;
using System.Security.Claims;

namespace PublicApi.Controllers
{
    //[AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _config;
        private readonly ITokenService _tokenService;

        public AccountController(UserManager<User> userManager, 
            SignInManager<User> signInManager,
            ITokenService tokenService,
            IConfiguration config)
        {
            this._signInManager = signInManager;
            this._tokenService = tokenService;
            this._config = config;
            this._userManager = userManager;
            this._httpClient = new()
            {
                BaseAddress = new System.Uri("https://graph.facebook.com")
            };
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            Guard.Against.Null(loginDto, nameof(loginDto));

            var user = await _userManager.Users
                .Include(p => p.Photos)
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null) return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (result.Succeeded)
            {
                await SetRefreshToken(user);
                return CreateUserObject(user);
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            Guard.Against.Null(registerDto, nameof(registerDto));

            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email is taken.");
                return ValidationProblem(ModelState);
            }

            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
            {
                ModelState.AddModelError("username", "Username is taken.");
                return ValidationProblem(ModelState);
            }

            var user = new User
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Username
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                await SetRefreshToken(user);
                return CreateUserObject(user);
            }

            return BadRequest("Problem registering user.");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.Users
                .Include(p => p.Photos)
                .FirstOrDefaultAsync(u => u.Email == User.FindFirstValue(ClaimTypes.Email));

            //await SetRefreshToken(user);
            return CreateUserObject(user!); 
        }

        [AllowAnonymous]
        [HttpPost("fbLogin")]
        public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken)
        {
            var fbVerifKeys = _config["Facebook:AppId"] + "|" + _config["Facebook:AppSecret"];
            var verifiedToken = await _httpClient
                .GetAsync($"debug_token?input_token={accessToken}&access_token={fbVerifKeys}");

            if (!verifiedToken.IsSuccessStatusCode) return Unauthorized();

            var fbUrl = $"me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";
            var response = await _httpClient
                .GetAsync(fbUrl);

            if (!response.IsSuccessStatusCode) return Unauthorized();

            var content = await response.Content
                .ReadAsStringAsync();
            var fbInfo = JsonConvert
                .DeserializeObject<dynamic>(await response.Content.ReadAsStringAsync());

            var username = (string)fbInfo.id;
            var user = await _userManager.Users
                .Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.UserName == username);

            if (user != null) 
            {
                await SetRefreshToken(user);
                return CreateUserObject(user);
            }

            user = new User
            {
                DisplayName = (string)fbInfo.name,
                Email = (string)fbInfo.email,
                UserName = (string)fbInfo.id,
                Photos = new List<Photo>{
                    new () {
                        Id = "fb_" + (string)fbInfo.id,
                        Url = (string)fbInfo.picture.data.url,
                        IsMain = true
                    }
                }
            };

            var result = await _userManager.CreateAsync(user);

            if (!result.Succeeded) return BadRequest("A problem occured while creating the user account.");

            await SetRefreshToken(user);
            return CreateUserObject(user);
        }

        [Authorize]
        [HttpPost("refreshToken")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var user = await _userManager.Users
                .Include(r => r.RefreshTokens)
                .Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));

            if (user == null) return Unauthorized();

            var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);

            if (oldToken != null && !oldToken.IsActive) return Unauthorized();

            //if (oldToken != null) oldToken.Revoked = DateTime.UtcNow;

            return CreateUserObject(user);
        }

        private async Task SetRefreshToken(User user)
        {
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken.Token!, cookieOptions);
        }

        private UserDto CreateUserObject(User user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = user.Photos?.FirstOrDefault(p => p.IsMain)?.Url,
                Token = _tokenService.CreateToken(user),
                Username = user.UserName
            };
        }
    }
}
