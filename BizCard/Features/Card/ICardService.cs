namespace BizCard.Features.Card
{
    public interface ICardService
    {
        public Task<Card> GetCard(string cardId);
        public Task<ICollection<Card>> GetCards(string userId);
        public Task<Card> GetMainCard(string username);
        public Task<string> PostCard(string userId);
        public Task<string> DeleteCard(string cardId);
        public Task<string> PutCard(Card card, bool isMain);
    }
}
