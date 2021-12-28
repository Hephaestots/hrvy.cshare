using Ardalis.GuardClauses;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PublicApi.DTOs;
using PublicApi.Interfaces;
using System.Security.Claims;

namespace PublicApi.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ITokenService _tokenService;

        public AccountController(UserManager<User> userManager, 
            SignInManager<User> signInManager,
            ITokenService tokenService)
        {
            this._signInManager = signInManager;
            this._tokenService = tokenService;
            this._userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            Guard.Against.Null(loginDto, nameof(loginDto));

            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (result.Succeeded)
                return CreateUserObject(user);

            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            Guard.Against.Null(registerDto, nameof(registerDto));

            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
                return BadRequest("Email taken.");

            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
                return BadRequest("Username taken.");

            var user = new User
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Username
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
                return CreateUserObject(user);

            return BadRequest("Problem registering user.");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user); 
        }

        private UserDto CreateUserObject(User user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = null,
                Token = _tokenService.CreateToken(user),
                Username = user.UserName
            };
        }
    }
}
