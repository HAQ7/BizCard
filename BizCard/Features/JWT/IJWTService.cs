namespace BizCard.Features.JWT
{
    public interface IJWTService
    {
        public string genarateJWTToken(User.User user);
    }
}
