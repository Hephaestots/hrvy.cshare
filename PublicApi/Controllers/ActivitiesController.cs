using API.Controllers.Base;
using Application.Activities;
using Application.Core;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetActivities([FromQuery]ActivityParams @params)
        {
            return HandlePagedResult(await Mediator.Send(new List.Query { Params = @params }));
        }

        /// <summary>
        /// Phony controller endpoint, but used the LINQ framework to filter by date.
        /// </summary>
        /// <param name="date">Date for activities to match and/or occur after.</param>
        /// <returns>List of activities.</returns>
        [HttpGet("/byDate/{date}")]
        public async Task<IActionResult> GetActivitiesByDate(string date)
        {
            return HandleResult(await Mediator.Send(new ListByDate.Query { Date = date }));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Activity = activity }));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            
            return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id) 
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}