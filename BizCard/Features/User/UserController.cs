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

        /// <summary>
        /// Gets the current logged in user profile information from the JWT Token.
        /// </summary>
        /// <returns>Returns the user profile with their cards and main card information</returns>
        /// <response code="200">Successfully retrieved user profile</response>
        /// <response code="401">Unauthorized - JWT token is missing or invalid</response>
        /// <response code="404">User not found</response>
        /// <produces>application/json</produces>
        [Authorize]
        [HttpGet("me")]
        [ProducesResponseType(typeof(UserDTO), 200)]
        [ProducesResponseType(typeof(string), 404)]
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

        /// <summary>
        /// Authenticates a user using username and password credentials.
        /// </summary>
        /// <param name="loginDTO">Login credentials containing username and password</param>
        /// <returns>Returns a JWT authentication token upon successful login</returns>
        /// <response code="200">Login successful, returns JWT token</response>
        /// <response code="400">Invalid request - validation errors or invalid credentials</response>
        /// <consumes>application/x-www-form-urlencoded</consumes>
        /// <produces>application/json</produces>
        [HttpPost("login")]
        [ProducesResponseType(typeof(string), 200)]
        [ProducesResponseType(typeof(string), 400)]
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

        /// <summary>
        /// Creates a new user account and returns an authentication token.
        /// </summary>
        /// <param name="signUpDTO">User registration information including username, password, email, phone, full name, and role</param>
        /// <returns>Returns a JWT authentication token upon successful registration</returns>
        /// <response code="200">Registration successful, returns JWT token</response>
        /// <response code="400">Invalid request - validation errors or user already exists</response>
        /// <consumes>application/x-www-form-urlencoded</consumes>
        /// <produces>application/json</produces>
        /// <remarks>
        /// Sample request:
        /// 
        ///     POST /api/User/SignUp
        ///     Content-Type: application/x-www-form-urlencoded
        ///     
        ///     username=johndoe&amp;password=SecurePass123&amp;confirmPassword=SecurePass123&amp;Email=john@example.com&amp;Phone=1234567890&amp;FullName=John Doe&amp;RoleName=Developer
        /// 
        /// </remarks>
        [HttpPost("SignUp")]
        [ProducesResponseType(typeof(string), 200)]
        [ProducesResponseType(typeof(string), 400)]
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

        /// <summary>
        /// Retrieves user avatar information from avatarapi.com service using an email address.
        /// </summary>
        /// <param name="email">Email address to retrieve avatar for</param>
        /// <returns>Returns avatar information including image URL and metadata</returns>
        /// <response code="200">Successfully retrieved avatar information</response>
        /// <response code="400">Invalid request - email parameter is missing</response>
        /// <response code="401">Unauthorized - JWT token is missing or invalid</response>
        /// <produces>application/json</produces>
        /// <remarks>
        /// Sample response:
        /// 
        ///     {
        ///       "Name": "John Doe",
        ///       "Image": "https://s3.avatarapi.com/fe975b72194e729e0883bab6f9d7e0d72c304fd2f28c9fe6a77afe840065aad7.gif",
        ///       "Valid": true,
        ///       "City": "New York",
        ///       "Country": "USA",
        ///       "IsDefault": false,
        ///       "Success": true,
        ///       "RawData": "",
        ///       "Source": {
        ///         "Name": "Microsoft"
        ///       }
        ///     }
        /// 
        /// </remarks>
        [HttpGet("avatar/{email}")]
        [Authorize]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(string), 400)]
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
