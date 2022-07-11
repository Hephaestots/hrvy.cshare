using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Tokens
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public User? User { get; set; } = null;
        public string? Token { get; set; } = string.Empty;
        public DateTime Expires { get; set; }
        public bool IsExpired => (DateTime.UtcNow >= Expires);
        public DateTime? Revoked { get; set; }
        public bool IsActive => (Revoked == null && !IsExpired);
    }
}
