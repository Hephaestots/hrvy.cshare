using Application.Profiles;
using Domain.Entities;

namespace Application.Activities.DTOs
{
    public class ActivityDto : BaseEntity<Guid>
    {
        public string? Title { get; set; }
        public DateTime Date { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? City { get; set; }
        public string? Venue { get; set; }
        public string? HostUsername { get; set; }
        public bool IsCancelled { get; set; }

        public ICollection<Profile> Attendees { get; set; } = new List<Profile>();
    }
}
