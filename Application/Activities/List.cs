using MediatR;
using Persistance.Data;
using Ardalis.GuardClauses;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Application.Interfaces;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<ActivityDto>>>
        {
            public ActivityParams? Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                this._context = context;
                this._mapper = mapper;
                this._userAccessor = userAccessor;
            }

            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                Guard.Against.Null(_context.Activities, nameof(_context.Activities));
                Guard.Against.Null(request.Params, nameof(request.Params));

                var query = _context.Activities
                    .Where(a => a.Date >= request.Params.StartDate)
                    .OrderBy(a => a.Date)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                                            new { currentUsername = _userAccessor.GetUsername() })
                    .AsQueryable();

                if (request.Params.IsGoing && !request.Params.IsHost)
                    query = query
                        .Where(x => x.Attendees.Any(a => a.Username == _userAccessor.GetUsername()));
                
                if (request.Params.IsHost && !request.Params.IsGoing)
                    query = query
                        .Where(x => x.HostUsername == _userAccessor.GetUsername());

                return Result<PagedList<ActivityDto>>.Success(
                    await PagedList<ActivityDto>
                    .CreateAsync(query, 
                        request.Params.PageNumber, 
                        request.Params.PageSize)    
                );
            }
        }
    }
}