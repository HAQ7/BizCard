﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BizCard.Features.Card
{
    public class Card
    {
        [Key]
        public string Id { get; set; }

        public string DisplayName { get; set; }

        public string? RoleName { get; set; }

        public string BGColor { get; set; }

        public string TextColor { get; set; }

        public string? Email { get; set; }

        public string? PhoneNumber { get; set; }

        public string? LinkedIn { get; set; }

        public string? X { get; set; }

        public string? CustomURLName { get; set; }

        public string? CustomURL { get; set; }

        [ForeignKey(nameof(Owner))]
        public string OwnerId { get; set; }

        public User.User Owner { get; set; }

    }
}
