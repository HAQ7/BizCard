using System.ComponentModel.DataAnnotations;

namespace BizCard.Features.User.DTOs
{
    public class LoginDTO
    {
        [Required(ErrorMessage = "{0} is missing")]
        public string username { get; set; }

        [Required(ErrorMessage = "{0} is missing")]
        public string password { get; set; }
    }
}
