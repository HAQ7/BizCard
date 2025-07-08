using BizCard.Features.JWT;
using BizCard.Shared.Exceptions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace BizCard.Features.User
{
    public class UserService : IUserService
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly IJWTService _jwtService;
        private readonly AppDBcontext _db;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public UserService(SignInManager<User> signInManager, UserManager<User> userManager, IJWTService jwtService, AppDBcontext db, HttpClient httpClient, IConfiguration configuration)
        {
            _jwtService = jwtService;
            _signInManager = signInManager;
            _userManager = userManager;
            _db = db;
            _httpClient = httpClient;
            _configuration = configuration;
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

            User? existingEmailUser = await _userManager.FindByEmailAsync(user.Email);
            if (existingEmailUser != null)
            {
                throw new HTTPException(400, "Email " + user.Email + " is already taken.");
            }



            IdentityResult result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                throw new HTTPException(400, string.Join(", ", result.Errors.Select(error => error.Description)));
            }

            return _jwtService.genarateJWTToken(user);
        }

        public async Task<User> GetUser(string userId)
        {
            User? user = await _db.Users
                .Include(u => u.MainCard)
                .Include(u => u.Cards)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                throw new HTTPException(404, "User not found");
            }
            return user;

        }

        public async Task<User> GetUserByUsername(string username)
        {
            User? user = await _db.Users
                .Include(u => u.MainCard)
                .Include(u => u.Cards)
                .FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null)
            {
                throw new HTTPException(404, "User not found");
            }
            return user;
        }

        public async Task<string> GetAvatar(string email)
        {

            string url = "https://avatarapi.com/v2/api.aspx";
            string plainTextBody = $"{{\"username\":\"{_configuration["Avatar:UserName"]}\",\"password\":\"{_configuration["Avatar:Password"]}\",\"email\":\"{email}\"}}";

            var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(plainTextBody, Encoding.UTF8, "text/plain")
            };

            HttpResponseMessage response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }

            string error = await response.Content.ReadAsStringAsync();
            throw new Exception($"Request failed: {response.StatusCode}, {error}");


        }
    }
}
