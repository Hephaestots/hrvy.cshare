using Domain.Entities;

namespace PublicApi.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
