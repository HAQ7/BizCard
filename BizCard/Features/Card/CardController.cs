using BizCard.Features.Card.DTOs;
using BizCard.Shared.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BizCard.Features.Card
{
    [Route("api/[controller]")]
    [ApiController]
    [TypeFilter(typeof(ExceptionFilter))]

    public class CardController : ControllerBase
    {
        private readonly ICardService _cardService;

        public CardController(ICardService cardService)
        {
            _cardService = cardService;
        }

        /// <summary>
        /// Retrieves a specific business card by its unique identifier.
        /// </summary>
        /// <param name="cardId">The unique identifier of the card to retrieve</param>
        /// <returns>Returns the business card information including owner details</returns>
        /// <response code="200">Successfully retrieved the card</response>
        /// <response code="404">Card not found</response>
        /// <produces>application/json</produces>
        [HttpGet("{cardId}")]
        [ProducesResponseType(typeof(CardDTO), 200)]
        [ProducesResponseType(typeof(string), 404)]
        public async Task<IActionResult> GetCard([FromRoute] string cardId)
        {
            Card card = await _cardService.GetCard(cardId);

            CardDTO cardDto = new CardDTO
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
                Owner = new OwnerDTO
                {
                    Id = card.Owner.Id,
                    UserName = card.Owner.UserName,
                    Email = card.Owner.Email,
                    FullName = card.Owner.FullName,
                    RoleName = card.Owner.RoleName,
                    PhoneNumber = card.Owner.PhoneNumber
                }
            };

            return Ok(cardDto);
        }

        /// <summary>
        /// Retrieves all business cards belonging to the authenticated user.
        /// </summary>
        /// <returns>Returns a list of all cards owned by the current user</returns>
        /// <response code="200">Successfully retrieved the user's cards</response>
        /// <response code="401">Unauthorized - JWT token is missing or invalid</response>
        /// <response code="404">User not found</response>
        /// <produces>application/json</produces>
        [HttpGet("cards")]
        [Authorize]
        [ProducesResponseType(typeof(List<CardDTO>), 200)]
        [ProducesResponseType(typeof(string), 404)]
        public async Task<IActionResult> GetCards()
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return NotFound("User not found");
            }

            ICollection<Card> cards = await _cardService.GetCards(userId);

            List<CardDTO> cardDtos = cards.Select(card => new CardDTO
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
                Owner = new OwnerDTO
                {
                    Id = card.Owner.Id,
                    UserName = card.Owner.UserName,
                    Email = card.Owner.Email,
                    FullName = card.Owner.FullName,
                    RoleName = card.Owner.RoleName,
                    PhoneNumber = card.Owner.PhoneNumber
                }
            }).ToList();

            return Ok(cardDtos);
        }

        /// <summary>
        /// Retrieves the main business card for a specific user by their username.
        /// </summary>
        /// <param name="username">The username of the user whose main card to retrieve</param>
        /// <returns>Returns the user's main business card information</returns>
        /// <response code="200">Successfully retrieved the main card</response>
        /// <response code="404">User or main card not found</response>
        /// <produces>application/json</produces>
        [HttpGet("main/{username}")]
        [ProducesResponseType(typeof(CardDTO), 200)]
        [ProducesResponseType(typeof(string), 404)]
        public async Task<IActionResult> GetMainCard(string username)
        {
            Card card = await _cardService.GetMainCard(username);


            CardDTO cardDto = new CardDTO
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
                Owner = new OwnerDTO
                {
                    Id = card.Owner.Id,
                    UserName = card.Owner.UserName,
                    Email = card.Owner.Email,
                    FullName = card.Owner.FullName,
                    RoleName = card.Owner.RoleName,
                    PhoneNumber = card.Owner.PhoneNumber
                }
            };

            return Ok(cardDto);
        }

        /// <summary>
        /// Creates a new business card for the authenticated user.
        /// </summary>
        /// <returns>Returns a success message with the new card ID</returns>
        /// <response code="200">Card created successfully</response>
        /// <response code="401">Unauthorized - JWT token is missing or invalid</response>
        /// <response code="404">User not found</response>
        /// <produces>application/json</produces>
        [HttpPost]
        [Authorize]
        [ProducesResponseType(typeof(string), 200)]
        [ProducesResponseType(typeof(string), 404)]
        public async Task<IActionResult> PostCard()
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // should not be possible, but just in case.
            if (userId == null)
            {
                return NotFound("User not found");
            }

            return Ok(await _cardService.PostCard(userId));
        }

        /// <summary>
        /// Deletes a specific business card by its unique identifier.
        /// </summary>
        /// <param name="cardId">The unique identifier of the card to delete</param>
        /// <returns>Returns a success message confirming deletion</returns>
        /// <response code="200">Card deleted successfully</response>
        /// <response code="401">Unauthorized - JWT token is missing or invalid</response>
        /// <response code="404">Card not found or user doesn't have permission</response>
        /// <produces>application/json</produces>
        [HttpDelete("{cardId}")]
        [Authorize]
        [ProducesResponseType(typeof(string), 200)]
        [ProducesResponseType(typeof(string), 404)]
        public async Task<IActionResult> DeleteCard(string cardId)
        {
            return Ok(await _cardService.DeleteCard(cardId));
        }

        /// <summary>
        /// Updates an existing business card with new information.
        /// </summary>
        /// <param name="putCardDTO">The updated card information including display name, role, colors, contact details, and social links</param>
        /// <param name="cardId">The unique identifier of the card to update</param>
        /// <returns>Returns a success message confirming the update</returns>
        /// <response code="200">Card updated successfully</response>
        /// <response code="400">Invalid request - validation errors</response>
        /// <response code="401">Unauthorized - JWT token is missing or invalid</response>
        /// <response code="404">Card not found or user doesn't have permission</response>
        /// <consumes>application/x-www-form-urlencoded</consumes>
        /// <produces>application/json</produces>
        /// <remarks>
        /// Sample request:
        /// 
        ///     PUT /api/Card/{cardId}
        ///     Content-Type: application/x-www-form-urlencoded
        ///     
        ///     DisplayName=John Doe&amp;RoleName=Software Developer&amp;BGColor=%23FF5733&amp;TextColor=%23FFFFFF&amp;Email=john@example.com&amp;PhoneNumber=1234567890&amp;LinkedIn=johndoe&amp;X=@johndoe&amp;CustomURLName=Portfolio&amp;CustomURL=https://johndoe.dev&amp;IsMain=true
        /// 
        /// All fields except IsMain are optional but must meet validation requirements:
        /// - DisplayName: 3-100 characters
        /// - RoleName: 3-100 characters  
        /// - BGColor: 3-10 characters (hex color)
        /// - TextColor: 3-10 characters (hex color)
        /// - Email: 3-100 characters, valid email format
        /// - PhoneNumber: 3-15 characters, valid phone format
        /// </remarks>
        [HttpPut("{cardId}")]
        [Authorize]
        [ProducesResponseType(typeof(string), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [ProducesResponseType(typeof(string), 404)]
        public async Task<IActionResult> PutCard([FromForm] PutCardDTO putCardDTO, [FromRoute] string cardId)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToArray();
                return BadRequest(string.Join('\n', errors));
            }

            return Ok(await _cardService.PutCard(
                new Card
                {
                    Id = cardId,
                    DisplayName = putCardDTO.DisplayName,
                    RoleName = putCardDTO.RoleName,
                    BGColor = putCardDTO.BGColor,
                    TextColor = putCardDTO.TextColor,
                    Email = putCardDTO.Email,
                    PhoneNumber = putCardDTO.PhoneNumber,
                    LinkedIn = putCardDTO.LinkedIn,
                    X = putCardDTO.X,
                    CustomURL = putCardDTO.CustomURL,
                    CustomURLName = putCardDTO.CustomURLName
                },
                putCardDTO.IsMain
            ));
        }
    }
}
