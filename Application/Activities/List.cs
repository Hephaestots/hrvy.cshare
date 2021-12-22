using MediatR;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Persistance.Data;
using Ardalis.GuardClauses;
using Application.Core;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<Activity>>> {}

        public class Handler : IRequestHandler<Query, Result<List<Activity>>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<Result<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
            {
                Guard.Against.Null(_context.Activities, nameof(_context.Activities));

                return Result<List<Activity>>.Success(await _context.Activities.ToListAsync());
            }
        }
    }
}