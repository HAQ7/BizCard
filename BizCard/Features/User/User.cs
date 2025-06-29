using Microsoft.AspNetCore.Identity;
using CardNamespace = BizCard.Features.Card;

namespace BizCard.Features.User
{
    public class User : IdentityUser
    {
        public override string UserName { get; set; }
        public string FullName { get; set; }

        public string RoleName { get; set; }

        public List<CardNamespace.Card>? Cards { get; set; }

        public CardNamespace.Card? MainCard { get; set; }

    }
}
