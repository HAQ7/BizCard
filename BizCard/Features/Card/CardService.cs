
using BizCard.Features.User;
using BizCard.Shared.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace BizCard.Features.Card
{
    public class CardService : ICardService
    {

        private readonly AppDBcontext _db;
        private readonly IUserService _userService;

        public CardService(AppDBcontext db, IUserService userService)
        {
            _db = db;
            _userService = userService;
        }
        public async Task<string> DeleteCard(string cardId)
        {
            Card card = await GetCard(cardId);
            _db.Cards.Remove(card);
            await _db.SaveChangesAsync();
            return card.Id;

        }

        public async Task<Card> GetCard(string cardId)
        {
            Card card = await _db.Cards.Include(c => c.Owner).FirstOrDefaultAsync(c => c.Id == cardId);

            if (card == null)
            {
                throw new HTTPException(404, "Card no found");
            }

            return card;


        }

        public async Task<ICollection<Card>> GetCards(string userId)
        {
            User.User user = await _userService.GetUser(userId);

            if (user.Cards == null)
            {
                throw new HTTPException(404, "user has no cards");
            }

            return user.Cards;
        }

        public async Task<Card> GetMainCard(string username)
        {
            User.User user = await _userService.GetUserByUsername(username);

            if (user.MainCard == null)
            {
                throw new HTTPException(404, "user has no main card");
            }

            return user.MainCard;

        }

        public async Task<string> PostCard(string userId)
        {
            User.User user = await _userService.GetUser(userId);

            Card card = new Card() { DisplayName = user.FullName, RoleName = user.RoleName, Email = user.Email, PhoneNumber = user.PhoneNumber, TextColor = "#000000", BGColor = "#ffffff", Id = Guid.NewGuid().ToString() };

            _db.Cards.Add(card);

            if (user.MainCard == null)
            {
                user.MainCard = card;
            }

            if (user.Cards == null)
            {
                user.Cards = [card];
            }
            else
            {
                user.Cards.Add(card);
            }

            await _db.SaveChangesAsync();

            return card.Id;
        }

        public async Task<string> PutCard(Card card, bool isMain)
        {
            Card updatedCard = await GetCard(card.Id);

            updatedCard.DisplayName = card.DisplayName;
            updatedCard.RoleName = card.RoleName;
            updatedCard.Email = card.Email;
            updatedCard.PhoneNumber = card.PhoneNumber;
            updatedCard.BGColor = card.BGColor;
            updatedCard.TextColor = card.TextColor;
            updatedCard.LinkedIn = card.LinkedIn;
            updatedCard.X = card.X;
            updatedCard.CustomURL = card.CustomURL;
            updatedCard.CustomURLName = card.CustomURLName;

            if (isMain)
            {
                updatedCard.Owner.MainCard = updatedCard;
            }

            await _db.SaveChangesAsync();

            return updatedCard.Id;


        }
    }
}
