using Domain.Entities;
using Infrastructure.Security.Requirements;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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

                        options.Events = new JwtBearerEvents
                        {
                            OnMessageReceived = context =>
                            {
                                //naming convention for SignalR Hub's token.
                                var accessToken = context.Request.Query["access_token"];
                                var path = context.HttpContext.Request.Path;
                                
                                if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/hubs/comments"))) {
                                    context.Token = accessToken;
                                }

                                return Task.CompletedTask; 
                            }
                        };
                    });

            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("IsActivityHost", policy =>
                {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });

            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();

            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}
