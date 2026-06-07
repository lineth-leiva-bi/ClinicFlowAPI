using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinicFlowAPI.Data;
using ClinicFlowAPI.Models;
using ClinicFlowAPI.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace ClinicFlowAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CitaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CitaController(AppDbContext context)
        {
            _context = context;
        }

        private bool ObtenerClienteId(out int clienteId)
        {
            clienteId = 0;

            var clienteIdToken = User.FindFirst("ClienteId")?.Value;

            if (string.IsNullOrEmpty(clienteIdToken))
                return false;

            if (!int.TryParse(clienteIdToken, out clienteId))
                return false;

            return clienteId > 0;
        }

        [HttpPost]
        public async Task<IActionResult> CrearCita([FromBody] CrearCitaDto citaDto)
        {
            if (!ObtenerClienteId(out int clienteId))
                return Unauthorized("El usuario no tiene un cliente asociado.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var clienteExiste = await _context.Clientes.AnyAsync(c => c.Id == clienteId);

            if (!clienteExiste)
                return BadRequest("El cliente no existe.");

            var cita = new Cita
            {
                ClienteId = clienteId,
                FechaHora = citaDto.FechaHora,
                Motivo = citaDto.Motivo,
                Estado = string.IsNullOrWhiteSpace(citaDto.Estado) ? "Pendiente" : citaDto.Estado,
                Observaciones = citaDto.Observaciones
            };

            _context.Citas.Add(cita);
            await _context.SaveChangesAsync();

            return Ok(cita);
        }

        [HttpGet("mis-citas")]
        public async Task<IActionResult> ObtenerMisCitas()
        {
            if (!ObtenerClienteId(out int clienteId))
                return Unauthorized("El usuario no tiene un cliente asociado.");

            var citas = await _context.Citas
                .Where(c => c.ClienteId == clienteId)
                .OrderBy(c => c.FechaHora)
                .ToListAsync();

            return Ok(citas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerCitaPorId(int id)
        {
            if (!ObtenerClienteId(out int clienteId))
                return Unauthorized("El usuario no tiene un cliente asociado.");

            var cita = await _context.Citas
                .FirstOrDefaultAsync(c => c.Id == id && c.ClienteId == clienteId);

            if (cita == null)
                return NotFound("Cita no encontrada.");

            return Ok(cita);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarCita(int id, [FromBody] CrearCitaDto citaDto)
        {
            if (!ObtenerClienteId(out int clienteId))
                return Unauthorized("El usuario no tiene un cliente asociado.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cita = await _context.Citas
                .FirstOrDefaultAsync(c => c.Id == id && c.ClienteId == clienteId);

            if (cita == null)
                return NotFound("Cita no encontrada.");

            cita.FechaHora = citaDto.FechaHora;
            cita.Motivo = citaDto.Motivo;
            cita.Estado = string.IsNullOrWhiteSpace(citaDto.Estado) ? cita.Estado : citaDto.Estado;
            cita.Observaciones = citaDto.Observaciones;

            await _context.SaveChangesAsync();

            return Ok(cita);
        }

        [HttpPatch("{id}/cancelar")]
        public async Task<IActionResult> CancelarCita(int id)
        {
            if (!ObtenerClienteId(out int clienteId))
                return Unauthorized("El usuario no tiene un cliente asociado.");

            var cita = await _context.Citas
                .FirstOrDefaultAsync(c => c.Id == id && c.ClienteId == clienteId);

            if (cita == null)
                return NotFound("Cita no encontrada.");

            cita.Estado = "Cancelada";

            await _context.SaveChangesAsync();

            return Ok(cita);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarCita(int id)
        {
            if (!ObtenerClienteId(out int clienteId))
                return Unauthorized("El usuario no tiene un cliente asociado.");

            var cita = await _context.Citas
                .FirstOrDefaultAsync(c => c.Id == id && c.ClienteId == clienteId);

            if (cita == null)
                return NotFound("Cita no encontrada.");

            _context.Citas.Remove(cita);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}