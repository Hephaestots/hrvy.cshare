using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistance.Data
{
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext() { }

        public DataContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new { aa.UserId, aa.ActivityId }));

            builder.Entity<ActivityAttendee>()
                .HasOne(u => u.User)
                .WithMany(a => a.Activities)
                .HasForeignKey(aa => aa.UserId);

            builder.Entity<ActivityAttendee>()
                .HasOne(u => u.Activity)
                .WithMany(a => a.Attendees)
                .HasForeignKey(aa => aa.ActivityId);

            builder.Entity<Comment>()
                .HasOne(a => a.Activity)
                .WithMany(c => c.Comments)
                .OnDelete(DeleteBehavior.Cascade);
        }

        public DbSet<Activity>? Activities { get; set; }

        public DbSet<ActivityAttendee>? ActivityAttendees { get; set; }

        public DbSet<Comment>? Comments { get; set; }

        public DbSet<Photo>? Photos { get; set;}
    }
}
