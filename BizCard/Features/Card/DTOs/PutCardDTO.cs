using System.ComponentModel.DataAnnotations;

namespace BizCard.Features.Card.DTOs
{
    public class PutCardDTO
    {
        [StringLength(100, MinimumLength = 3, ErrorMessage = "{0} has to be between {2} and {1}")]
        public string DisplayName { get; set; }

        [StringLength(100, MinimumLength = 3, ErrorMessage = "{0} has to be between {2} and {1}")]
        public string RoleName { get; set; }


        [StringLength(10, MinimumLength = 3, ErrorMessage = "{0} has to be between {2} and {1}")]
        public string BGColor { get; set; }

        [StringLength(10, MinimumLength = 3, ErrorMessage = "{0} has to be between {2} and {1}")]
        public string TextColor { get; set; }

        [StringLength(100, MinimumLength = 3, ErrorMessage = "{0} has to be between {2} and {1}")]
        [EmailAddress]
        public string? Email { get; set; }

        [StringLength(15, MinimumLength = 3, ErrorMessage = "{0} has to be between {2} and {1}")]
        [Phone]
        public string? PhoneNumber { get; set; }

        public string? LinkedIn { get; set; }

        public string? X { get; set; }

        public string? CustomURLName { get; set; }

        public string? CustomURL { get; set; }

        public bool IsMain { get; set; }


    }
}
