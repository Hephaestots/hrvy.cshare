namespace Domain.Entities
{
    public class StructureNode : Node
    {
        public bool IsRequired { get; set; } = false;

        public StructureNode()
        {
            Id = Guid.NewGuid();
        }
    }
}
