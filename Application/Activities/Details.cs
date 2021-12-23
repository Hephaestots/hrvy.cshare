using Domain.Entities;
using Persistance.Data;

using MediatR;
using Application.Core;
using Ardalis.GuardClauses;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<Activity>> 
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Activity>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                Guard.Against.Null(_context.Activities, nameof(_context.Activities));

                var activity = await _context.Activities.FindAsync(request.Id);

                return Result<Activity>.Success(activity!);
            }
        }
    }
}