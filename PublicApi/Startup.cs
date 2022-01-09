using Application.Activities;
using API.Extensions;
using FluentValidation.AspNetCore;
using PublicApi.Middleware;
using PublicApi.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using PublicApi.SignalR;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;

        public Startup(IConfiguration config)
        {
            _config = config; 
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers(opt =>
                    {
                        var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser()
                                                                     .Build();
                        opt.Filters.Add(new AuthorizeFilter(policy));
                    })
                    .AddFluentValidation(config =>
                    {
                        config.RegisterValidatorsFromAssemblyContaining<Create>();
                    });

            services.AddApplicationServices(_config);

            services.AddIdentityServices(_config);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Exception middleware.
            app.UseMiddleware<ExceptionMiddleware>();

            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseCors("CorsPolicy");

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<CommentHub>("/hubs/comments");
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
