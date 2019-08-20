﻿using VikingVault.Services.Abstractions;
using VikingVault.DataAccess.Models;
using System.Web.Http;
using Microsoft.AspNetCore.Mvc;
using VikingVault.API.SecurityFilters;

namespace VikingVault.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        IAccountService _accountService;

        public AccountsController(IAccountService accService)
        {
            _accountService = accService;
        }

        [HttpGet]
        [AuthorizeUser]
        public ActionResult<UserAccount> Get()
        {
            var token = Request.Headers["x-access-token"];

            UserAccount userAccount = _accountService.GetUserAccount(token);

            if (userAccount != null)
            {
                return Ok(userAccount);
            }  
            else
            {
                return NotFound();
            }
        }

    }
}
