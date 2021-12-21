using MediatR;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Persistance.Data;
using Ardalis.GuardClauses;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<Activity>> {}

        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                Guard.Against.Null(_context.Activities, nameof(_context.Activities));

                return await _context.Activities.ToListAsync();
            }
        }
    }
}