using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class CommentDto : BaseEntity<Guid>
    {
        public string? Body { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? DisplayName { get; set; }
        public string? Image { get; set; }
        public string? Username { get; set; }
    }
}
