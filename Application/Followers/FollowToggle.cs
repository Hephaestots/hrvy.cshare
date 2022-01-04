using Application.Core;
using Application.Interfaces;
using Ardalis.GuardClauses;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string? TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this._context = context;
                this._userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                Guard.Against.Null(request.TargetUsername, nameof(request.TargetUsername));
                Guard.Against.Null(_context.UserFollowings, nameof(_context.UserFollowings));

                var observer = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                var target = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserName == request.TargetUsername);

                if (target == null) return null;

                var following = await _context.UserFollowings.FindAsync(observer!.Id, target.Id);

                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };
                    _context.UserFollowings.Add(following);
                } 
                else
                {
                    _context.UserFollowings.Remove(following);
                }

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Problem with toggling the following.");
            }
        }
    }
}
