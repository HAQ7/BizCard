using BizCard.Features.Card.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BizCard.Features.Card
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardController : ControllerBase
    {
        private readonly ICardService _cardService;

        public CardController(ICardService cardService)
        {
            _cardService = cardService;
        }

        [HttpGet("{cardId}")]
        public async Task<IActionResult> GetCard(string cardId)
        {
            return Ok(await _cardService.GetCard(cardId));
        }

        [HttpGet("cards")]
        [Authorize]
        public async Task<IActionResult> GetCards()
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // should not be possible, but just in case.
            if (userId == null)
            {
                return NotFound("User not found");
            }

            return Ok(await _cardService.GetCards(userId));
        }

        [HttpGet("main/{username}")]
        public async Task<IActionResult> GetMainCard(string username)
        {
            return Ok(await _cardService.GetMainCard(username));
        }

        [HttpPost]
        [Authorize]
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

        [HttpDelete("{cardId}")]
        [Authorize]
        public async Task<IActionResult> DeleteCard(string cardId)
        {
            return Ok(await _cardService.DeleteCard(cardId));
        }

        [HttpPut("{cardId}")]
        [Authorize]
        public async Task<IActionResult> PutCard([FromForm] PutCardDTO putCardDTO, [FromRoute] string cardId)
        {
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
