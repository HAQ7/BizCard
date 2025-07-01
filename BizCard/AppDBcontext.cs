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

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // User has many Cards (one-to-many)
        builder.Entity<User>()
            .HasMany(u => u.Cards)
            .WithOne(c => c.Owner)
            .HasForeignKey(c => c.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        // User has one MainCard (one-to-one, optional)
        builder.Entity<User>()
            .HasOne(u => u.MainCard)
            .WithMany()
            .HasForeignKey(u => u.MainCardId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

