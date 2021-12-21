using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class NodeHistory : History
    {
        public Guid NodeId { get; set; }
        public Guid? ParentId { get; set; }
        public int Sort { get; set; }
        public int Level { get; set; }
        public NodeType Type { get; set; } = NodeType.Simple;
        public NodeStatus Status { get; set; } = NodeStatus.New;

        public NodeHistory()
        {
            this.Id = Guid.NewGuid();
        }
    }
}
