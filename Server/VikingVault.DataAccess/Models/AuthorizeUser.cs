﻿using System;
using System.IdentityModel.Tokens.Jwt;
using System.Web.Http.Filters;

namespace VikingVault.DataAccess.Models
{
    public class AuthorizeUser : Attribute, IAuthorizationFilter
    {
        void IAuthorizationFilter.OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                string token = context.HttpContext.Request.Headers["x-access-token"].ToString();
                var tokenObject = new JwtSecurityToken(token);
                string userId = tokenObject.Payload["Id"].ToString();
                if (userId == null)
                {
                    context.Result = new ForbidResult();
                }
            }
            catch (Exception ex)
            {
                context.Result = new StatusCodeResult(500);
            }
        }
    }
}