using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace PublicApi.SignalR.Base
{
    public class BaseHub : Hub
    {
        protected readonly IMediator _mediator;

        public BaseHub(IMediator mediator)
        {
            this._mediator = mediator;
        }
    }
}
