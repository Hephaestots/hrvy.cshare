using Application.Core;
using Application.Interfaces;
using Ardalis.GuardClauses;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
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
                Guard.Against.Null(_context.Activities, nameof(_context.Activities));

                var activity = await _context.Activities
                    .Include(a => a.Attendees)
                    .ThenInclude(u => u.User)
                    .SingleOrDefaultAsync(x => x.Id == request.Id);

                if (activity == null) return null;

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                var hostUsername = activity.Attendees
                    .FirstOrDefault(a => a.IsHost)?.User?.UserName;

                var attendance = activity.Attendees.FirstOrDefault(a => a.User?.UserName == user.UserName);

                if (attendance != null)
                {
                    if (hostUsername == user.UserName)
                        activity.IsCancelled = !activity.IsCancelled;
                    else
                        activity.Attendees.Remove(attendance);
                } else
                {
                    attendance = new Domain.Entities.ActivityAttendee
                    {
                        User = user,
                        Activity = activity,
                        IsHost = false
                    };

                    activity.Attendees.Add(attendance);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure("Error while updating attendance.");
            }
        }
    }
}
