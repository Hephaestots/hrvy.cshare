namespace Domain.Entities
{
    /// <summary>
    /// Node abstraction, using hierarchy structures.
    /// </summary>
    public abstract class Node : BaseEntity<Guid>
    {
        public string? Code { get; set; }
        public Guid? ParentId { get; set; }
        public int Sort { get; set; }
        public int Level { get; set; }
        public NodeType Type { get; set; } = NodeType.Simple;
        public NodeStatus Status { get; set; } = NodeStatus.New;
    }

    public enum NodeType
    {
        Simple = 1,
        Complex = 2,
        Root = 3
    }

    public enum NodeStatus
    {
        New = 1,
        Active = 2,
        Inactive = 3,
        Deleted = 4
    }
}
