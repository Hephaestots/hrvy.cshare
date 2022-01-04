using MediatR;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
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
            public PagingParams? Params { get; set; }
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
                    .OrderBy(a => a.Date)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                                            new { currentUsername = _userAccessor.GetUsername() })
                    .AsQueryable();

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