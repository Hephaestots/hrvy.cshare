using Domain.Entities;
using Domain.Entities.Tokens;
using Microsoft.IdentityModel.Tokens;
using PublicApi.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace PublicApi.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration congif)
        {
            _config = congif;
        }

        public string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                 new Claim(ClaimTypes.Name, user.UserName),
                 new Claim(ClaimTypes.NameIdentifier, user.Id),
                 new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Token:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateJwtSecurityToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public RefreshToken GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return new RefreshToken { Token = Convert.ToBase64String(randomNumber) };
        }
    }
}
