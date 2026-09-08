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

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("Registrarme")]
        public async Task<IActionResult> Registrar([FromBody] RegistroUsuarioDto dto)
        {
            var usuarioExiste = await _context.Usuarios
                .AnyAsync(u => u.usuario == dto.Email);

            if (usuarioExiste)
                return BadRequest("El usuario ya existe.");

            var clienteExiste = await _context.Clientes
                .AnyAsync(c => c.Email == dto.Email);

            if (clienteExiste)
                return BadRequest("Ya existe un cliente con este correo.");

            var nuevoCliente = new Cliente
            {
                Nombre = dto.Nombre,
                PrimerApellido = dto.PrimerApellido,
                SegundoApellido = dto.SegundoApellido,
                Email = dto.Email,
                Telefono = dto.Telefono,
                Activo = true
            };

            _context.Clientes.Add(nuevoCliente);
            await _context.SaveChangesAsync();

            var passwordService = new SeguridadContrasenna();

            var nuevoUsuario = new Usuario
            {
                usuario = dto.Email,
                contrasenna = passwordService.HashPassword(dto.Contrasenna),
                rol = "Cliente",
                ClienteId = nuevoCliente.Id
            };

            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            return Ok("Usuario registrado correctamente");
        }

        [HttpPost("login")]
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
