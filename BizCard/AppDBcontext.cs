using BizCard.Features.Card;
using BizCard.Features.User;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


public class AppDBcontext : IdentityDbContext<User>
{
    public AppDBcontext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Card> Cards { get; set; }

}

