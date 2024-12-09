using API.Interfaces;

namespace API.Data;

public class UnitOfWork(DataContext context, ICountryRepository countryRepository, IFollowsRepository followsRepository,
    ILikesRepository likesRepository, IMessageRepository messageRepository, INotificationRepository notificationRepository,
    IStatisticsRepository statisticsRepository, ITravelRepository travelRepository, IUserRepository userRepository) : IUnitOfWork
{
    public ICountryRepository CountryRepository => countryRepository;

    public IFollowsRepository FollowsRepository => followsRepository;

    public ILikesRepository LikesRepository => likesRepository;

    public IMessageRepository MessageRepository => messageRepository;

    public INotificationRepository NotificationRepository => notificationRepository;

    public IStatisticsRepository StatisticsRepository => statisticsRepository;

    public ITravelRepository TravelRepository => travelRepository;

    public IUserRepository UserRepository => userRepository;

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public bool HasChanges()
    {
        return context.ChangeTracker.HasChanges();
    }
}