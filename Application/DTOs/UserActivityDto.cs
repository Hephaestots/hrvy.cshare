using Domain.Entities;
using System.Text.Json.Serialization;

namespace Application.DTOs
{
    public class UserActivityDto : BaseEntity<Guid>
    {
        public string? Title { get; set; }
        public string? Category { get; set; }
        public DateTime Date { get; set; }

        [JsonIgnore]
        public string? HostUsername { get; set; }
    }
}
