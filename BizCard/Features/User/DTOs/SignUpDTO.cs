using System.ComponentModel.DataAnnotations;

namespace BizCard.Features.User.DTOs
{
    public class SignUpDTO
    {
        [Required(ErrorMessage = "{0} is missing")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "{0} has to be between {2} and {1}")]
        public string username { get; set; }

        [Required(ErrorMessage = "{0} is missing")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "{0} has to be between {2} and {1}")]
        public string password { get; set; }

        [Required(ErrorMessage = "{0} is missing")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "{0} has to be between {2} and {1}")]
        [Compare("password", ErrorMessage = "{0} and {1} are not same")]
        public string confirmPassword { get; set; }

        [Required(ErrorMessage = "{0} is missing")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "{0} has to be between {2} and {1}")]
        [EmailAddress(ErrorMessage = "Email address is not correct")]
        public string Email { get; set; }

        [Required(ErrorMessage = "{0} is missing")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "{0} has to be between {2} and {1}")]

        [Phone(ErrorMessage = "phone number is not correct")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "{0} is missing")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "{0} has to be between {2} and {1}")]

        public string FullName { get; set; }

        [Required(ErrorMessage = "{0} is missing")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "{0} has to be between {2} and {1}")]

        public string RoleName { get; set; }



    }
}
