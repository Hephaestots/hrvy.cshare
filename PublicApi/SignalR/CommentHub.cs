using Application.Comments;
using Ardalis.GuardClauses;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using PublicApi.SignalR.Base;

namespace PublicApi.SignalR
{
    public class CommentHub : BaseHub
    {
        public CommentHub(IMediator mediator) : base(mediator)
        { }

        public async Task SendComment(Create.Command command)
        {
            Guard.Against.Null(command, nameof(command));

            var comment = await _mediator.Send(command);

            await Clients
                .Group(command.ActivityId.ToString())
                .SendAsync("ReceiveComment", comment.Value);
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();

            Guard.Against.Null(httpContext, nameof(httpContext));

            var activityId = httpContext.Request.Query["activityId"];

            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);

            var result = await _mediator.Send(new List.Query { ActivityId = Guid.Parse(activityId) });

            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }
}
