using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinicFlowAPI.Data;
using ClinicFlowAPI.Models;
using ClinicFlowAPI.DTOs;

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

        public AuthController(AppDbContext context )
        {
            _context = context;
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar(Usuario usuario)
        {
            var passwordService = new SeguridadContrasenna();

            usuario.contrasenna = passwordService.HashPassword(usuario.contrasenna);

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok("Usuario registrado"); 
        }

        [HttpPost("inicio")]
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

            return Ok("Login exitoso");
        }
    }



}
