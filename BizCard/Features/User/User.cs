using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CardNamespace = BizCard.Features.Card;

namespace BizCard.Features.User
{
    public class User : IdentityUser
    {
        [Key]
        public override string Id { get; set; }

        public override string UserName { get; set; }

        public override string Email { get; set; }

        public string FullName { get; set; }

        public string RoleName { get; set; }

        public List<CardNamespace.Card>? Cards { get; set; }

        [ForeignKey(nameof(MainCard))]
        public string? MainCardId { get; set; }

        public CardNamespace.Card? MainCard { get; set; }

    }
}
