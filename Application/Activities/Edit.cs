using Ardalis.GuardClauses;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Persistance.Data;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest 
        {
            public Activity Activity { get; set; }

            public class Handler : IRequestHandler<Command>
            {
                private readonly DataContext _context;
                private readonly IMapper _mapper;

                public Handler(DataContext context, IMapper mapper)
                {
                    this._context = context;
                    this._mapper = mapper;
                }

                public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
                {
                    Guard.Against.Null(_context.Activities, nameof(_context.Activities));

                    var activity = await _context.Activities.FindAsync(request.Activity.Id);

                    _mapper.Map(request.Activity, activity);

                    await _context.SaveChangesAsync();

                    return Unit.Value;
                }
            }
        }
    }
}