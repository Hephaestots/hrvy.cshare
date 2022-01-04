using Domain.Entities;
using Persistance.Data;

using MediatR;
using Application.Core;
using Ardalis.GuardClauses;
using AutoMapper;
using Application.DTOs;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Application.Interfaces;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<ActivityDto>> 
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
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

            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                Guard.Against.Null(_context.Activities, nameof(_context.Activities));

                var activity = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                                            new { currentUsername = _userAccessor.GetUsername() })
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                return Result<ActivityDto>.Success(activity!);
            }
        }
    }
}