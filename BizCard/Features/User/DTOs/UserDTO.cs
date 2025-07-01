namespace BizCard.Features.User.DTOs
{
    public class UserDTO
    {
        public string Id { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string FullName { get; set; }

        public string RoleName { get; set; }

        public string PhoneNumber { get; set; }

        public UserCardDTO MainCard { get; set; }

        public List<UserCardDTO> Cards { get; set; }
    }
}
