using BizCard.Features.JWT;
using BizCard.Shared.Exceptions;
using Microsoft.AspNetCore.Identity;

namespace BizCard.Features.User
{
    public class UserService : IUserService
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly IJWTService _jwtService;

        public UserService(SignInManager<User> signInManager, UserManager<User> userManager, IJWTService jwtService)
        {
            _jwtService = jwtService;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        public async Task<string> Login(string username, string password)
        {
            User? user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                throw new HTTPException(401, "Incorrect username or password");
            }


            SignInResult result = await _signInManager.CheckPasswordSignInAsync(user, password, false);
            if (!result.Succeeded)
            {
                throw new HTTPException(401, "Incorrect username or password");
            }


            return _jwtService.genarateJWTToken(user);
        }

        public async Task<string> SignUp(User user, string password)
        {
            IdentityResult result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                throw new HTTPException(400, string.Join(", ", result.Errors.Select(error => error.Description)));
            }

            return _jwtService.genarateJWTToken(user);
        }

        public async Task<User> GetUser(string Id)
        {
            User? user = await _userManager.FindByIdAsync(Id);
            if (user == null)
            {
                throw new HTTPException(404, "User not found");
            }
            return user;

        }
    }
}
