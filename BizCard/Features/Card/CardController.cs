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

        [HttpGet("{cardId}")]
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

        [HttpGet("cards")]
        [Authorize]
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

        [HttpGet("main/{username}")]
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
