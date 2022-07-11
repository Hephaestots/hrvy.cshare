using Domain.Entities;
using Domain.Entities.Tokens;

namespace PublicApi.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(User user);
        RefreshToken GenerateRefreshToken();
    }
}
