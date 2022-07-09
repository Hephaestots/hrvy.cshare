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
                        var policy = new AuthorizationPolicyBuilder()
                            .RequireAuthenticatedUser()
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
            /* Middleware */
            app.UseMiddleware<ExceptionMiddleware>();
            
            /* Security Headers */
            app.UseCsp(opt => opt
                .BlockAllMixedContent()
                .StyleSources(s => s.Self().CustomSources(
                    "https://fonts.googleapis.com",
                    "sha256-yR2gSI6BIICdRRE2IbNP1SJXeA5NYPbaM32i/Y8eS9o="
                ))
                .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
                .FormActions(s => s.Self())
                .FrameAncestors(s => s.Self())
                .ImageSources(s => s.Self().CustomSources(
                    "https://res.cloudinary.com", 
                    "https://www.facebook.com",
                    "https://platform-lookaside.fbsbx.com",
                    "data:"
                ))
                .ScriptSources(s => s.Self())
                .ScriptSources(s => s.Self().CustomSources(
                    "sha256-khMFfTbom33H77mXJRdiySRUVyGB4dpYESefs00gjH4=",
                    "https://connect.facebook.net",
                    "https://www.facebook.com"
                ))
            );
            app.UseReferrerPolicy(opt => opt.NoReferrer());
            app.UseXContentTypeOptions();
            app.UseXfo(opt => opt.Deny());
            app.UseXXssProtection(opt => opt.EnabledWithBlockMode());

            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
            }
            else
            {
                app.Use(async (context, next) =>
                {
                    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
                    await next.Invoke();
                });
            }

            app.UseHttpsRedirection();
            app.UseRouting();

            /* Packaged Webapp */
            app.UseDefaultFiles();
            app.UseStaticFiles();

            /* Policies */
            app.UseCors("CorsPolicy");

            /* Authorization & Authentication */
            app.UseAuthentication();
            app.UseAuthorization();

            /* Endpoints */
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<CommentHub>("/hubs/comments");
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
