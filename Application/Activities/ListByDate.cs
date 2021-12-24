using Application.Core;
using Ardalis.GuardClauses;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class ListByDate
    {
        public class Query : IRequest<Result<List<Activity>>>
        {
            public string? Date { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Activity>>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<Result<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
            {
                Guard.Against.NullOrEmpty(request.Date, nameof(request.Date));
                Guard.Against.Null(_context.Activities, nameof(_context.Activities));

                bool isValidDate = DateTime.TryParse(request.Date.ToString(), out DateTime requestedDate);

                if (!isValidDate) return Result<List<Activity>>.Failure("The date is not valid.");

                return Result<List<Activity>>.Success(await _context.Activities
                                                                    .Where(act => act.Date.CompareTo(requestedDate) >= 0)
                                                                    .ToListAsync());
            }
        }
    }
}
