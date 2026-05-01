using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinicFlowAPI.Data;
using ClinicFlowAPI.Models;
using ClinicFlowAPI.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ClinicFlowAPI.Controllers
{
    //convierte la clase en API
    [ApiController]

    //cuando ingresen a api Auth ejecute este controller
    [Route("api/[controller]")]

    public class AuthController : ControllerBase
    {
        //conexión a la BD
        private readonly AppDbContext _context;

        //conexión con el token 
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context,IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("Registrarme")]
        public async Task<IActionResult> Registrar(Usuario usuario)
        {
            var passwordService = new SeguridadContrasenna();

            usuario.contrasenna = passwordService.HashPassword(usuario.contrasenna);

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok("Usuario registrado"); 
        }

        [HttpPost("Iniciar Sesión")]
        public async Task<IActionResult> Inicio([FromBody] InicioDto inicio)
        {
            var usuarioactualizado = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.usuario == inicio.Usuario);

            if (usuarioactualizado == null)
                return Unauthorized("Usuario no existe");

            var passwordService = new SeguridadContrasenna();

            var valido = passwordService.VerifyPassword(
                usuarioactualizado.contrasenna, 
                inicio.Contrasenna
            );

            if (!valido)
                return Unauthorized("Contraseña incorrecta");

            var token = GenerarToken(usuarioactualizado);

            return Ok(new
            {
                mensaje = "Login exitoso",
                token = token
            });
        }

        //metodo que genera el token 
        private string GenerarToken(Usuario usuario)
        {
            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
        new Claim(ClaimTypes.Name, usuario.usuario),
        new Claim(ClaimTypes.Role, usuario.rol),
        new Claim("ClienteId", usuario.ClienteId?.ToString() ?? "")
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
            );

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }



}
