using Application.Core;
using Application.Interfaces;
using Ardalis.GuardClauses;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile? File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, 
                IPhotoAccessor photoAccessor, 
                IUserAccessor userAccessor)
            {
                this._context = context;
                this._photoAccessor = photoAccessor;
                this._userAccessor = userAccessor;
            }

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                Guard.Against.Null(request.File, nameof(request.File));

                var user = await _context.Users
                    .Include(p => p.Photos)
                    .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                var uploadResult = await _photoAccessor.AddPhoto(request.File);
                var photo = new Photo
                {
                    Id = uploadResult.PublicId,
                    Url = uploadResult.Url
                };

                if (!user.Photos.Any(p => p.IsMain)) photo.IsMain = true;

                user.Photos.Add(photo);

                var result = await _context.SaveChangesAsync() > 0;

                if (result) return Result<Photo>.Success(photo);
                return Result<Photo>.Failure("Problem adding photo.");
            }
        }
    }
}
