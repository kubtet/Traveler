namespace API.Interfaces;

public interface IUnitOfWork
{
    ICountryRepository CountryRepository { get; }
    IFollowsRepository FollowsRepository { get; }
    ILikesRepository LikesRepository { get; }
    IMessageRepository MessageRepository { get; }
    INotificationRepository NotificationRepository { get; }
    IStatisticsRepository StatisticsRepository { get; }
    ITravelRepository TravelRepository { get; }
    IUserRepository UserRepository { get; }
    Task<bool> Complete();
    bool HasChanges();
}
