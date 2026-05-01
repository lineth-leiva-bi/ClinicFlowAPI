using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinicFlowAPI.Data;
using ClinicFlowAPI.Models;
using ClinicFlowAPI.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace ClinicFlowAPI.Controllers
{

    [Authorize]

    //convierte la clase en API
    [ApiController]

    //cuando ingresen a api cita ejecute este controller
    [Route("api/[controller]")]

    public class CitaController : ControllerBase
    {

        //conexión a la BD
        private readonly AppDbContext _context;

        public CitaController(AppDbContext context) {   

            _context = context;

        }

        //Crear cita, validando que los datos sean correctos y crea la cita mientras que valida con token 
        [HttpPost]
        public async Task<IActionResult> CrearCita([FromBody] CrearCitaDto citaDto)
        {
            var clienteIdToken = User.FindFirst("ClienteId")?.Value;

            if (string.IsNullOrEmpty(clienteIdToken))
                return Unauthorized("Token sin ClienteId");

            if (!int.TryParse(clienteIdToken, out int clienteId))
                return Unauthorized("ClienteId inválido en el token");

            if (clienteId == 0)
                return Unauthorized("El usuario no tiene un cliente asociado");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var clienteExiste = await _context.Clientes
                .AnyAsync(c => c.Id == clienteId);

            if (!clienteExiste)
                return BadRequest("El cliente no existe.");

            var cita = new Cita
            {
                ClienteId = clienteId,
                FechaHora = citaDto.FechaHora,
                Motivo = citaDto.Motivo,
                Estado = citaDto.Estado,
                Observaciones = citaDto.Observaciones
            };

            _context.Citas.Add(cita);
            await _context.SaveChangesAsync();

            return Ok(cita);
        }

        // Obtener solo las citas del cliente logueado
        [HttpGet("Mis Citas")]
        public async Task<IActionResult> ObtenerCitasPorUsuario()
        {
            var clienteIdToken = User.FindFirst("ClienteId")?.Value;

            if (string.IsNullOrEmpty(clienteIdToken))
                return Unauthorized("Token sin ClienteId");

            if (!int.TryParse(clienteIdToken, out int clienteId))
                return Unauthorized("ClienteId inválido en el token");

            if (clienteId == 0)
                return Unauthorized("El usuario no tiene un cliente asociado");

            var citas = await _context.Citas
                .Where(c => c.ClienteId == clienteId)
                .OrderBy(c => c.FechaHora)
                .ToListAsync();

            return Ok(citas);
        }

    }
}
