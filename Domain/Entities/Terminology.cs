using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Terminology : BaseEntity<Guid>
    {
        public Guid NodeId { get; private set; }
        public string? NameFr { get; set; }
        public string? NameEn { get; set; }
        public string? DescriptionFr { get; set; }
        public string? DescriptionEn { get; set; }
        public string? DefaultFr { get; set; }
        public string? DefaultEn { get; set; }
        public string? HelpFr { get; set; }
        public string? HelpEn { get; set; }

        /// <summary>
        /// Default constructor.
        /// </summary>
        /// <param name="nodeId">Node identifier.</param>
        public Terminology(Guid nodeId)
        {
            Id = Guid.NewGuid();
            NameFr = string.Empty;
            NameEn = string.Empty;
            DescriptionFr = string.Empty;
            DescriptionEn = string.Empty;
            DefaultFr = string.Empty;
            DefaultEn = string.Empty;
            HelpFr = string.Empty;
            HelpEn = string.Empty;
            NodeId = nodeId;
        }
    }
}
