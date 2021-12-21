using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class TerminologyHistory : History
    {
        public Guid TerminologyId { get; set; }
        public string? NameFr { get; set; }
        public string? NameEn { get; set; }
        public string? DescriptionFr { get; set; }
        public string? DescriptionEn { get; set; }
        public string? DefaultFr { get; set; }
        public string? DefaultEn { get; set; }
        public string? HelpFr { get; set; }
        public string? HelpEn { get; set; }

        public TerminologyHistory(Guid userId) : base()
        {
            AddedBy = userId;
        }
    }
}
