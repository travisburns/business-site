using Microsoft.AspNetCore.SignalR;

namespace Pipeline.Hubs
{
    public class ScrapingHub : Hub
    {
        public async Task JoinSession(string sessionId) =>
            await Groups.AddToGroupAsync(Context.ConnectionId, $"session_{sessionId}");

        public async Task LeaveSession(string sessionId) =>
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"session_{sessionId}");
    }
}
