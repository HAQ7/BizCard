using BizCard.Features.User.DTOs;
using BizCard.Shared.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BizCard.Features.User
{
    [Route("api/[controller]")]
    [ApiController]
    [TypeFilter(typeof(ExceptionFilter))]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            string? Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (Id == null)
            {
                return NotFound("User not found");
            }

            User? user = await _userService.GetUser(Id);
            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> PostLogin([FromForm] LoginDTO loginDTO)
        {
            string token = await _userService.Login(loginDTO.username, loginDTO.password);

            return Ok(token);
        }

        [HttpPost("SignUp")]
        public async Task<IActionResult> PostSignUp([FromForm] SignUpDTO signUpDTO)
        {

            string token = await _userService.SignUp(new User() { Id = new Guid().ToString(), Email = signUpDTO.Email, UserName = signUpDTO.username, PhoneNumber = signUpDTO.Phone, FullName = signUpDTO.FullName, RoleName = signUpDTO.RoleName }, signUpDTO.password);
            return Ok(token);
        }
    }
}
