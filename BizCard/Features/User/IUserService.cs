namespace BizCard.Features.User
{
    public interface IUserService
    {
        public Task<string> SignUp(User user, string password);

        public Task<string> Login(string username, string password);

        public Task<User> GetUser(string Id);

    }
}
