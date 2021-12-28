using Domain.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Persistance.Data;
using PublicApi.Interfaces;
using PublicApi.Services;
using System.Text;

namespace PublicApi.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services,
                                                             IConfiguration config)
        {
            services.AddIdentityCore<User>(opt =>
                    {
                        opt.Password.RequireNonAlphanumeric = false;
                    })
                    .AddEntityFrameworkStores<DataContext>()
                    .AddSignInManager<SignInManager<User>>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Token:SecretKey"]));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = key,
                            ValidateIssuer = false,
                            ValidateAudience = false
                        };
                    });

            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}
