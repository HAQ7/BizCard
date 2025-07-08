using BizCard.Features.User.DTOs;
using BizCard.Shared.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BizCard.Features.User
{
    [ApiController]
    [Route("api/[controller]")]
    [TypeFilter(typeof(ExceptionFilter))]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize]
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

            // Map user's cards to CardDTOs
            List<UserCardDTO>? cardDTOs = user.Cards?.Select(card => new UserCardDTO
            {
                Id = card.Id,
                DisplayName = card.DisplayName,
                RoleName = card.RoleName,
                BGColor = card.BGColor,
                TextColor = card.TextColor,
                Email = card.Email,
                PhoneNumber = card.PhoneNumber,
                LinkedIn = card.LinkedIn,
                X = card.X,
                CustomURLName = card.CustomURLName,
                CustomURL = card.CustomURL,
            }).ToList();

            // Map main card if present
            UserCardDTO? mainCardDTO = null;
            if (user.MainCard != null)
            {
                mainCardDTO = new UserCardDTO
                {
                    Id = user.MainCard.Id,
                    DisplayName = user.MainCard.DisplayName,
                    RoleName = user.MainCard.RoleName,
                    BGColor = user.MainCard.BGColor,
                    TextColor = user.MainCard.TextColor,
                    Email = user.MainCard.Email,
                    PhoneNumber = user.MainCard.PhoneNumber,
                    LinkedIn = user.MainCard.LinkedIn,
                    X = user.MainCard.X,
                    CustomURLName = user.MainCard.CustomURLName,
                    CustomURL = user.MainCard.CustomURL
                };
            }

            UserDTO userDTO = new UserDTO()
            {
                Id = user.Id,
                UserName = user.UserName,
                FullName = user.FullName,
                RoleName = user.RoleName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                MainCard = mainCardDTO,
                Cards = cardDTOs ?? new List<UserCardDTO>()
            };

            return Ok(userDTO);
        }

        [HttpPost("login")]
        public async Task<IActionResult> PostLogin([FromForm] LoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToArray();
                return BadRequest(string.Join('\n', errors));
            }

            string token = await _userService.Login(loginDTO.username, loginDTO.password);
            return Ok(token);
        }

        [HttpPost("SignUp")]
        public async Task<IActionResult> PostSignUp([FromForm] SignUpDTO signUpDTO)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToArray();
                return BadRequest(string.Join('\n', errors));
            }

            string token = await _userService.SignUp(
                new User()
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = signUpDTO.Email,
                    UserName = signUpDTO.username,
                    PhoneNumber = signUpDTO.Phone,
                    FullName = signUpDTO.FullName,
                    RoleName = signUpDTO.RoleName
                },
                signUpDTO.password
            );
            return Ok(token);
        }

        [HttpGet("avatar/{email}")]
        [Authorize]
        public async Task<IActionResult> GetAvatar([FromRoute] string email)
        {
            if (email == null)
            {
                return BadRequest("email is missing");
            }

            return Ok(await _userService.GetAvatar(email));
        }
    }
}
