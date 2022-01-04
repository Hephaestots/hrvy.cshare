using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using Ardalis.GuardClauses;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;
using System.Linq;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            public string? Predicate { get; set; }
            public string? Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
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

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                Guard.Against.Null(_context.UserFollowings, nameof(_context.UserFollowings));

                var profiles = new List<Profiles.Profile>();

                switch(request.Predicate)
                {
                    case "followers":
                        profiles = await _context.UserFollowings
                            .Where(uf => uf.Target!.UserName == request.Username)
                            .Select(uf => uf.Observer)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, 
                                                         new { currentUsername = _userAccessor.GetUsername() })
                            .ToListAsync();
                        break;
                    case "following":
                        profiles = await _context.UserFollowings
                            .Where(uf => uf.Observer!.UserName == request.Username)
                            .Select(uf => uf.Target)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider,
                                                         new { currentUsername = _userAccessor.GetUsername() })
                            .ToListAsync();
                        break;
                }

                return Result<List<Profiles.Profile>>.Success(profiles);
            }
        }
    }
}
