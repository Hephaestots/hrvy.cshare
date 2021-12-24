using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Persistance.Data;

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

            services.AddAuthentication();

            return services;
        }
    }
}
